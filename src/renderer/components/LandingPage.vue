<template>
    <div class="md-layout">
        <md-empty-state md-label="Welcome to OpenVRT" md-description="Open a prescription map to begin."/>
        <md-button class="md-fab md-primary md-fab-bottom-left" v-on:click="openFilePicker">
            <md-icon>add</md-icon>
        </md-button>
    </div>
</template>

<script>
  const fs = require('fs')
  const shp = require('shpjs')

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
          if (filePaths) {
            fs.readFile(filePaths[0]).then(this.parseFile)
          }
        })
      },
      parseFile (err, data) {
        if (err) {
          throw err
        }
        console.log(data)
      },
    },
  }
</script>