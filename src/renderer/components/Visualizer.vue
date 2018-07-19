<template>
    <div>
        <div id="map" class="md-elevation-2" v-bind:class="{hover: hover}">
            <attr-popover :visible="popover.visible" :x="popover.x" :y="popover.y"
                          :attributes="popover.attributes"></attr-popover>
        </div>
        <md-snackbar md-position="center" :md-duration="10000" :md-active.sync="showSnackbar" md-persistent>
            <span>{{ snackbarMsg }}</span>
            <md-button class="md-primary" @click="showSnackbar = false">OK</md-button>
        </md-snackbar>
    </div>
</template>

<style scoped>
    #map {
        width: 95%;
        height: 900px;
        margin: 2%;
        z-index: 0;
    }

    .hover {
        cursor: pointer;
    }
</style>
<script>
  import { ipcRenderer } from 'electron'

  import Map from 'ol/map'
  import View from 'ol/view'

  import GeoJSON from 'ol/format/geojson'

  import Vector from 'ol/layer/vector'
  import Tile from 'ol/layer/tile'
  import Group from 'ol/layer/group'

  import OSM from 'ol/source/osm'
  import VectorSource from 'ol/source/vector'

  import Style from 'ol/style/style'
  import Stroke from 'ol/style/stroke'
  import Fill from 'ol/style/fill'

  import AttributePopover from './AttributePopover'

  export default {
    name: 'visualizer',
    computed: {
      geoData () {
        return this.$store.state.OpenedGeoJson.data
      },
      exportErrorMsg () {
        return this.$store.state.OpenedGeoJson.exportErrorMsg
      },
      openErrorMsg () {
        return this.$store.state.OpenedGeoJson.shapeErrorMsg
      },
    },
    components: {
      'attr-popover': AttributePopover,
    },
    data () {
      return {
        map: null,
        vectorLayer: null,
        features: null,
        hover: false,
        minRate: 0,
        maxRate: 0,
        showSnackbar: false,
        snackbarMsg: '',
        popover: {
          attributes: {
            name: '',
            rate: '',
          },
          visible: false,
          x: 0,
          y: 0,
        },
      }
    },
    mounted () {
      ipcRenderer.on('exportToJson', this.openExporter)
      this.generateOpenLayersMap()
      this.onFileOpened()
      this.$store.subscribe((mutation) => {
        const {type} = mutation
        switch (type) {
          case 'GEO_SUCCESS_FILE':
            this.onFileOpened()
            break
          case 'GEO_INVALID_FILE':
            this.onErrorOpeningFile()
            break
          case 'GEO_EXPORT_ERROR':
            this.onErrorExportingFile()
            break
          case 'GEO_EXPORT_SUCCESS':
            this.onExportSuccessfully()
            break
        }
      })
    },
    methods: {
      openExporter () {
        this.$electron.remote.dialog.showSaveDialog({
          title: 'Export...',
          defaultPath: 'OpenVRT-Map.geojson',
          filters: [
            {name: 'GeoJSON', extensions: ['geojson', 'json']},
          ],
        }, (target) => {
          this.$store.dispatch('exportContents', target)
        })
      },
      generateOpenLayersMap () {
        this.map = new Map({
          target: 'map',
          controls: [],
          layers: [],
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
        })
        this.map.on('click', this.onClickMap)
        this.map.on('pointermove', this.onMouseMove)
      },
      onClickMap (e) {
        const featureFound = this.map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
          const properties = feature.getProperties()
          this.popover.attributes.name = properties.NAME ? properties.NAME : ''
          this.popover.attributes.rate = properties.RATE
          return true
        })
        featureFound ? this.openPopover(e.pixel[0], e.pixel[1]) : this.closePopover()
      },
      onMouseMove (e) {
        if (e.dragging) {
          this.closePopover()
        } else {
          const pixel = this.map.getEventPixel(e.originalEvent)
          this.hover = this.map.hasFeatureAtPixel(pixel)
        }
      },
      openPopover (x, y) {
        this.popover.x = x
        this.popover.y = y
        this.popover.visible = true
      },
      closePopover () {
        this.popover.visible = false
      },
      centralize () {
        const reference = this.features[0].getGeometry()
        this.map.getView().fit(reference.getExtent(), this.map.getSize())
      },
      style (feature) {
        const properties = feature.getProperties()
        const color = this.getColorForRate(properties.RATE)
        return new Style({
          stroke: new Stroke({
            color: `hsla(${color[0]}, ${color[1]}, ${color[2]}, 1.0)`,
            width: 1,
          }),
          fill: new Fill({
            color: `hsla(${color[0]}, ${color[1]}, ${color[2]}, 0.1)`,
          }),
        })
      },
      getColorForRate (rate) {
        const percentage = this.rateToPercentage(rate)
        const hue = ((1 - percentage) * 120).toString(10)
        return [hue, '100%', '50%']
      },
      rateToPercentage (rate) {
        return (rate - this.minRate) / (this.maxRate + this.minRate)
      },
      generateFeatures () {
        this.features = (new GeoJSON()).readFeatures(this.geoData, {featureProjection: 'EPSG:3857'})
      },
      generateVectorLayer () {
        this.vectorLayer = new Vector({
          source: new VectorSource({
            features: this.features,
          }),
          style: this.style,
        })
      },
      updateLayers () {
        this.map.setLayerGroup(
          new Group({
            layers: [
              new Tile({
                source: new OSM(),
              }),
              this.vectorLayer,
            ],
          }))
      },
      calculateRateRange () {
        let max = Number.NEGATIVE_INFINITY
        let min = Number.POSITIVE_INFINITY
        this.features.forEach((feature) => {
          const properties = feature.getProperties()
          const rate = properties.RATE
          if (rate > max) {
            max = rate
          }
          if (rate < min) {
            min = rate
          }
        })
        this.minRate = min
        this.maxRate = max
      },
      onFileOpened () {
        this.generateFeatures()
        this.calculateRateRange()
        this.generateVectorLayer()
        this.updateLayers()
        this.centralize()
      },
      onErrorOpeningFile () {
        this.snackbarMsg = this.openErrorMsg
        this.showSnackbar = true
      },
      onErrorExportingFile () {
        this.snackbarMsg = this.exportErrorMsg
        this.showSnackbar = true
      },
      onExportSuccessfully () {
        this.snackbarMsg = 'File exported successfully'
        this.showSnackbar = true
      },
    },
  }
</script>

