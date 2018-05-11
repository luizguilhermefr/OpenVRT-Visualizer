<template>
    <div class="md-layout md-alignment-center-center">
        <div>
            <md-empty-state md-label="Welcome to OpenVRT" md-description="Open a prescription map to begin.">
                <span class="md-body-2 error">
                    {{ errorMessage }}
                </span>
                <md-progress-spinner md-mode="indeterminate" :md-diameter="30" v-show="loading"></md-progress-spinner>
            </md-empty-state>
            <md-list class="md-triple-line" v-for="file in previousFiles" :key="file.id">
                <md-list-item>
                    <div class="md-list-item-text">
                        <a href="#" @click="openPath(file)">{{ file }}</a>
                    </div>
                    <md-button class="md-icon-button md-list-action" @click="removePath(file)">
                        <md-icon>close</md-icon>
                    </md-button>
                </md-list-item>
            </md-list>
        </div>
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
    data () {
      return {
        errorMessage: '',
        loading: false,
      }
    },
    computed: {
      previousFiles () {
        return this.$store.state.PreviousFiles.previousFiles
      },
    },
    methods: {
      openFilePicker () {
        this.$electron.remote.dialog.showOpenDialog({
          properties: ['openFile'],
          filters: [
            {name: 'Zip Files', extensions: ['zip']},
          ],
        }, this.processFilePaths)
      },
      processFilePaths (paths) {
        if (paths) {
          this.openPath(paths[0])
        }
      },
      openPath (path) {
        this.loading = true
        fs.readFile(path, this.parseFile)
        this.$store.commit('PUSH_PATH', path)
      },
      parseFile (err, data) {
        if (err) {
          this.errorReadingFile(err.message)
        } else {
          this.convertToGeoJson(data)
        }
      },
      convertToGeoJson (data) {
        shp(data).then((geojson) => {
          this.publishGeoJson(geojson)
        }, (err) => {
          this.errorReadingFile(err.message)
        })
      },
      errorReadingFile (message) {
        this.loading = false
        this.errorMessage = 'Error reading file: ' + message
      },
      publishGeoJson (geoJson) {
        this.loading = false
        this.errorMessage = ''
        this.$store.commit('OPEN_GEO', geoJson)
        this.$router.push('visualizer')
      },
      removePath (path) {
        this.$store.commit('REMOVE_PATH', path)
      },
    },
  }
</script>
