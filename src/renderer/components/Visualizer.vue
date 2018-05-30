<template>
    <div id="map" class="md-elevation-2"></div>
</template>

<style scoped>
    #map {
        width: 95%;
        height: 900px;
        margin: 2%;
        background-color: cornsilk;
    }
</style>

<script>
  import Map from 'ol/map'
  import View from 'ol/view'
  import Control from 'ol/control'
  import Proj from 'ol/proj'

  import GeoJSON from 'ol/format/geojson'

  import Vector from 'ol/layer/vector'
  import Tile from 'ol/layer/tile'

  import OSM from 'ol/source/osm'
  import VectorSource from 'ol/source/vector'

  import Geometry from 'ol/geom/geometry'

  import Styles from './styles/mapstyle'

  export default {
    name: 'visualizer',
    computed: {
      geoData () {
        return this.$store.state.OpenedGeoJson.data
      },
    },
    data () {
      return {
        map: null,
        features: null
      }
    },
    mounted () {
      this.generateFeatures()
      this.generateOpenLayersMap()
      this.centralize()
    },
    methods: {
      generateOpenLayersMap () {
        this.map = new Map({
          target: 'map',
          layers: [
            new Tile({
              source: new OSM(),
            }),
            new Vector({
              source: new VectorSource({
                features: this.features,
              }),
              style: this.style,
            }),
          ],
          controls: Control.defaults({
            attributionOptions: {
              collapsible: false,
            },
          }),
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
        })
      },
      centralize() {
        const reference = this.features[0].getGeometry()
        this.map.getView().fit(reference.getExtent(), this.map.getSize())
      },
      style (feature) {
        return Styles[feature.getGeometry().getType()]
      },
      generateFeatures() {
        this.features = (new GeoJSON()).readFeatures(this.geoData, {featureProjection: 'EPSG:3857'})
      }
    },
  }
</script>
