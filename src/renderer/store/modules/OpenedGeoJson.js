import fs from 'fs'
import shp from 'shpjs'

const state = {
  data: null,
  error: false,
  errorMsg: '',
}

const mutations = {
  GEO_SUCCESS_FILE (state, data) {
    state.data = data
    state.error = false
    state.errorMsg = ''
  },
  CLOSE_GEO (state) {
    state.data = null
    state.error = false
    state.errorMsg = ''
  },
  GEO_INVALID_FILE (state, errorMsg = '') {
    state.data = null
    state.error = true
    state.errorMsg = errorMsg
  },
  GEO_EXPORT_ERROR (state, errorMsg = '') {
    //
  },
  GEO_EXPORT_SUCCESS (state) {
    //
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
      }, function (err) {
        // Invalid shapefile
        const {message} = err
        context.commit('GEO_INVALID_FILE', message)
      })
    })
  },
  exportContents (context, path) {
    fs.writeFile(path, JSON.stringify(context.state.data), (err) => {
      if (err) {
        context.commit('GEO_EXPORT_ERROR')
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
