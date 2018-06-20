<template>
    <div id="map" class="md-elevation-2" v-bind:class="{hover: hover}">
        <attr-popover :visible="popover.visible" :x="popover.x" :y="popover.y"
                      :attributes="popover.attributes"></attr-popover>
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
  import Map from 'ol/map'
  import View from 'ol/view'

  import GeoJSON from 'ol/format/geojson'

  import Vector from 'ol/layer/vector'
  import Tile from 'ol/layer/tile'
  import Group from 'ol/layer/group'

  import OSM from 'ol/source/osm'
  import VectorSource from 'ol/source/vector'

  import Styles from './styles/mapstyle'
  import AttributePopover from './AttributePopover'

  export default {
    name: 'visualizer',
    computed: {
      geoData () {
        return this.$store.state.OpenedGeoJson.data
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
        popover: {
          attributes: {
            name: '',
            hectares: '',
            rate: '',
          },
          visible: false,
          x: 0,
          y: 0,
        },
      }
    },
    mounted () {
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
        }
      })
    },
    methods: {
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
          this.popover.attributes.rate = properties.RATE ? properties.RATE : ''
          this.popover.attributes.hectares = properties.HECTARES ? properties.HECTARES : ''
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
        return Styles[feature.getGeometry().getType()]
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
      onFileOpened () {
        this.generateFeatures()
        this.generateVectorLayer()
        this.updateLayers()
        this.centralize()
      },
      onErrorOpeningFile () {
      },
    },
  }
</script>

