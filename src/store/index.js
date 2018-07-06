import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'

import weather from './module/weather'
Vue.use(Vuex)

export default new Vuex.Store({
  state,
  modules: {
    weather
  }
})
