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
  import GeoJSON from 'ol/format/geojson'
  import View from 'ol/view'

  import Vector from 'ol/layer/vector'
  import Tile from 'ol/layer/tile'

  import Proj from 'ol/proj'
  import Control from 'ol/control'

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
    data () {
      return {
        map: null,
      }
    },
    mounted () {
      this.generateOpenLayersMap()
    },
    methods: {
      generateOpenLayersMap () {
        this.map = new Map({
          target: 'map',
          layers: [
            new Tile({
              source: new OSM()
            }),
            this.generateVectorLayer(),
          ],
          controls: Control.defaults({
            attributionOptions: {
              collapsible: false,
            },
          }),
          view: new View({
            center: Proj.fromLonLat([
              121.767277, -3.963446,
            ]),
            zoom: 2,
          }),
        })
      },
      style (feature) {
        return Styles[feature.getGeometry().getType()]
      },
      generateVectorLayer () {
        return new Vector({
          source: this.generateVectorSource(),
          style: this.style
        })
      },
      generateVectorSource () {
        return new VectorSource({
          features: (new GeoJSON()).readFeatures(this.geoData),
        })
      },
    },
  }
</script>
