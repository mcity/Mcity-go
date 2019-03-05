import transactions from './url-transactions'

const modules = {
  transactions
}

const state = {
  lastURL: null
}

const mutations = {
  setLastURL (state, payload) {
    state.lastURL = payload
  }
}

export default {
  namespaced: true,
  modules,
  state,
  mutations
}
