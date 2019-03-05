import api from '../../api'

const {
  createURL
} = api

const actions = {
  createURLAction ({ commit }, requestBody) {
    return createURL(requestBody)
      .then(response => commit('url/setLastURL', response.data, { root: true }))
      .catch(e => commit('logError', e, { root: true }))
  }
}

export default {
  namespaced: true,
  actions
}
