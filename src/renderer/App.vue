<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'openvrt-visualizer',
  }
</script>

<style lang="scss">
    @import "~vue-material/dist/theme/engine"; // Import the theme engine

    .error {
        color: md-get-palette-color(red, A700)
    }
</style>