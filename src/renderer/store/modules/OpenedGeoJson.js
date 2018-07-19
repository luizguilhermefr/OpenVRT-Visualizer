import fs from 'fs'
import shp from 'shpjs'

const state = {
  data: null,
  shapeError: false,
  shapeErrorMsg: '',
  exportError: false,
  exportErrorMsg: '',
}

const mutations = {
  GEO_SUCCESS_FILE (state, data) {
    state.data = data
    state.shapeError = false
    state.shapeErrorMsg = ''
  },
  GEO_INVALID_FILE (state, errorMsg = '') {
    state.data = null
    state.shapeError = true
    state.shapeErrorMsg = errorMsg
  },
  GEO_EXPORT_SUCCESS (state) {
    state.exportError = false
    state.exportErrorMsg = ''
  },
  GEO_EXPORT_ERROR (state, errorMsg = '') {
    state.exportError = true
    state.exportErrorMsg = errorMsg
  },
}

const actions = {
  readFileContents (context, path) {
    fs.readFile(path, (err, data) => {
      if (err) {
        // Errors like permissions or file not found
        const {message} = err
        context.commit('GEO_INVALID_FILE', message)

        return
      }

      if (path.endsWith('.json') || path.endsWith('.geojson')) {
        try {
          const geoObject = JSON.parse(data.toString())
          context.commit('GEO_SUCCESS_FILE', geoObject)
          context.commit('GEO_PUSH_PATH', path)
        } catch (err2) {
          // Invalid JSON file
          const {message} = err2
          context.commit('GEO_INVALID_FILE', message)
        }

        return
      }

      shp(data).then((geoObject) => {
        context.commit('GEO_SUCCESS_FILE', geoObject)
        context.commit('GEO_PUSH_PATH', path)
      }, function () {
        // Invalid shapefile
        context.commit('GEO_INVALID_FILE',
          'Invalid prescription map. If you are trying to open an ESRI Shapefile, make sure the .shp, .shx and .dbf files are compressed within a zip file.')
      })
    })
  },
  exportContents (context, path) {
    fs.writeFile(path, JSON.stringify(context.state.data), (err) => {
      if (err) {
        const {message} = err
        context.commit('GEO_EXPORT_ERROR', message)
        return
      }

      context.commit('GEO_EXPORT_SUCCESS')
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
