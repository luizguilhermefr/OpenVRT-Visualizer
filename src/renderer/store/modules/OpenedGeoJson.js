const state = {
  data: null,
}

const mutations = {
  OPEN_GEO (state, data) {
    state.data = data
  },
  CLOSE_GEO (state) {
    state.data = null
  },
}

const actions = {
  //
}

export default {
  state,
  mutations,
  actions,
}
