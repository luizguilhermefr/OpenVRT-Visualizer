import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

import modules from './modules'

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  modules: ['PreviousFiles']
})

Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: process.env.NODE_ENV !== 'production',
  plugins: [vuexLocal.plugin],
})
