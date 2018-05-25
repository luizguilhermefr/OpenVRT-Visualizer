<template>
    <div id="map"></div>
</template>

<script>
  import ol from 'ol'

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
        this.map = new ol.Map({
          target: 'map',
          layers: [
            vectorLayer
          ],
        })
      },
      generateVectorSource () {
        return new ol.source.Vector({
          features: (new ol.format.GeoJSON()).readFeatures(this.geoData())
        })
      },
      generateVectorLayer(vectorSource) {
        return new ol.layer.Vector({
          source: vectorSource
        })
      }
    },
  }
</script>
