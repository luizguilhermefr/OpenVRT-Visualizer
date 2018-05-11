<template>
    <div>
    </div>
</template>

<script>
  export default {
    name: 'visualizer',
    computed: {
      geoData () {
        return this.$store.state.OpenedGeoJson.data
      },
    },
    mounted () {
      console.log(this.geoData)
    }
  }
</script>
