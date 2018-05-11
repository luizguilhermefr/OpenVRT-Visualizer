const state = {
  previousFiles: [],
}

const mutations = {
  REMOVE_PATH (state, path) {
    state.previousFiles = state.previousFiles.filter((el) => el !== path)
  },
  PUSH_PATH (state, path) {
    state.previousFiles = state.previousFiles.filter((el) => el !== path)
    state.previousFiles.push(path)
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
