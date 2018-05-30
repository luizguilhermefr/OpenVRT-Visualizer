<template>
    <div id="map"></div>
</template>

<script>
  import Map from 'ol/map'
  import VectorSource from 'ol/source/vector'
  import GeoJSON from 'ol/format/geojson'
  import Vector from 'ol/layer/vector'
  import View from 'ol/view'

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
            this.generateVectorLayer(),
          ],
          view: new View({
            center: [
              -8.810269960287718,
              115.23514275881486,
            ],
          }),
        })
      },
      generateVectorLayer () {
        return new Vector({
          source: this.generateVectorSource(),
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
