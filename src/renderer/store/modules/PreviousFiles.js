const state = {
  previousFiles: [],
}

const mutations = {
  GEO_REMOVE_PATH (state, path) {
    state.previousFiles = state.previousFiles.filter((el) => el !== path)
  },
  GEO_PUSH_PATH (state, path) {
    state.previousFiles = state.previousFiles.filter((el) => el !== path)
    state.previousFiles.unshift(path)
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
