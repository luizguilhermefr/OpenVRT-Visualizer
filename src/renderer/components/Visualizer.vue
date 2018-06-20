<template>
    <div id="map" class="md-elevation-2"></div>
</template>

<style scoped>
    #map {
        width: 95%;
        height: 900px;
        margin: 2%;
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

  export default {
    name: 'visualizer',
    computed: {
      geoData () {
        return this.$store.state.OpenedGeoJson.data
      },
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
    data () {
      return {
        map: null,
        vectorLayer: null,
        features: null,
      }
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

