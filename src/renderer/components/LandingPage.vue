<template>
    <div class="md-layout">
        <md-empty-state md-label="Welcome to OpenVRT" md-description="Open a prescription map to begin."/>
        <md-button class="md-fab md-primary md-fab-bottom-left" v-on:click="openFilePicker">
            <md-icon>add</md-icon>
        </md-button>
    </div>
</template>

<script>
  export default {
    name: 'landing-page',
    components: {},
    methods: {
      openFilePicker () {
        this.$electron.remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            {name: 'Zip Files', extensions: ['zip']},
          ],
        }, (filePaths) => {
          console.log(filePaths)
        })
      },
    },
  }
</script>