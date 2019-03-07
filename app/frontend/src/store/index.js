import Vuex from 'vuex'
import Vue from 'vue'
import url from './modules/url'
import session from 'mcity-vue-auth/src/dist/session'

Vue.config.devtools = true
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    session,
    url
  },
  state: {
    errors: [],
    presentMode: false,
    isUserAdmin: false,
    isUserLoading: false,
    mixpanelEnabled: process.env.NODE_ENV,
    adminRole: 'URLADMIN'
  },
  mutations: {
    logError (state, err) {
      console.log(err.response)
      state.errors.push(err.response)
    },
    updatePresentationMode (state) {
      state.presentMode = !state.presentMode
    },
    setIsUserAdmin (state, payload) {
      state.isUserAdmin = payload
    },
    setIsUserLoading (state, payload) {
      state.isUserLoading = payload
    }
  },
  getters: {
    getPresentMode: state => state.presentMode,
    mixpanelEnabled: state => state.mixpanelEnabled === 'production',
    getErrors: state => state.errors,
    isUserAdmin: state => state.isUserAdmin
  }
})
