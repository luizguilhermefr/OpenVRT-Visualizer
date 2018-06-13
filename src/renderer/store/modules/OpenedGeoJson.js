import fs from 'fs'
import shp from 'shpjs'

const state = {
  data: null,
  error: false,
  errorMsg: ''
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
}

const actions = {
  readFileContents (context, path) {
    fs.readFile(path, (err, data) => {
      if (err) {
        // Errors like permissions or file not found
        const {message} = err
        context.commit('GEO_INVALID_FILE', message)
      } else {
        shp(data).then((geoObject) => {
          // GeoJSON valid and ready-to-go
          context.commit('GEO_SUCCESS_FILE', geoObject)
          context.commit('GEO_PUSH_PATH', path)
        }, function (err) {
          // GeoJSON is invalid
          const {message} = err
          context.commit('GEO_INVALID_FILE', message)
        })
      }
    })
  },
}

export default {
  state,
  mutations,
  actions,
}
