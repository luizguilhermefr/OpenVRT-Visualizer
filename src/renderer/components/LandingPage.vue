<template>
    <div class="md-layout md-alignment-center-center">
        <div>
            <md-empty-state md-label="Welcome to OpenVRT" md-description="Open a prescription map to begin">
                <span class="md-body-2 error" v-show="errorReadingFile">
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
  import { ipcRenderer } from 'electron'

  export default {
    name: 'landing-page',
    components: {},
    data () {
      return {
        loading: false,
      }
    },
    mounted () {
      ipcRenderer.on('openFile', this.openFilePicker)
      ipcRenderer.on('exportToJson', this.openExporter)
      this.$store.subscribe((mutation) => {
        const {type} = mutation
        switch (type) {
          case 'GEO_SUCCESS_FILE':
            this.onFileOpened()
            break
          case 'GEO_INVALID_FILE':
            this.onErrorOpeningFile()
            break
        }
      })
    },
    computed: {
      previousFiles () {
        return this.$store.state.PreviousFiles.previousFiles
      },
      errorMessage () {
        return this.$store.state.OpenedGeoJson.errorMsg
      },
      errorReadingFile () {
        return this.$store.state.OpenedGeoJson.error
      },
    },
    methods: {
      openFilePicker () {
        this.$electron.remote.dialog.showOpenDialog({
          title: 'Open file...',
          properties: ['openFile'],
          filters: [
            {name: 'Zip Files', extensions: ['zip']},
            {name: 'GeoJSON Files', extensions: ['json', 'geojson']},
          ],
        }, (paths) => {
          if (paths) {
            this.openPath(paths[0])
          }
        })
      },
      openExporter () {
        this.$electron.remote.dialog.showSaveDialog({
          title: 'Export...',
          defaultPath: 'OpenVRT-Map.geojson',
          filters: [
            {name: 'GeoJSON', extensions: ['geojson', 'json']},
          ],
        }, (target) => {
          this.$store.dispatch('exportContents', target)
        })
      },
      openPath (path) {
        this.loading = true
        this.$store.dispatch('readFileContents', path)
      },
      removePath (path) {
        this.$store.commit('GEO_REMOVE_PATH', path)
      },
      onFileOpened () {
        this.loading = false
        ipcRenderer.send('fileOpened')
        this.$router.replace('visualizer')
      },
      onErrorOpeningFile () {
        this.loading = false
      },
    },
  }
</script>
