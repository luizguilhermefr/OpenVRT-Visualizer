<template>
    <div class="md-elevation-3 attr-popover" v-bind:style="visibilityDimensions">
        <md-list v-show="visible">
            <md-list-item>Name: {{ attributes.name }}</md-list-item>
            <md-list-item>Rate: {{ attributes.rate }}</md-list-item>
        </md-list>
    </div>
</template>

<style scoped>
    .attr-popover {
        position: absolute;
        width: 250px;
        height: auto;
        background-color: white;
        z-index: 1000;
    }
</style>

<script>
  export default {

    name: 'attr-popover',
    props: [
      'attributes',
      'visible',
      'x',
      'y',
    ],
    computed: {
      visibilityDimensions () {
        return {
          left: this.x + 'px',
          top: this.y + 'px',
          'margin-left': this.visible ? 0 : '-999em',
        }
      },
    },
  }
</script>
