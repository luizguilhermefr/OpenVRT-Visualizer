<template>
    <div id="map"></div>
</template>

<script>
  import Map from 'ol/map'
  import SourceVector from 'ol/source/vector'
  import GeoJSON from 'ol/format/geojson'
  import Vector from 'ol/layer/vector'

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
        const vectorSource = this.generateVectorSource()
        const vectorLayer = this.generateVectorLayer(vectorSource)
        this.map = new Map({
          target: 'map',
          layers: [
            vectorLayer
          ],
        })
      },
      generateVectorSource () {
        return new SourceVector({
          features: (new GeoJSON()).readFeatures(this.geoData)
        })
      },
      generateVectorLayer(vectorSource) {
        return new Vector({
          source: vectorSource
        })
      }
    },
  }
</script>
