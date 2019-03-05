import axios from 'axios'

export default {
  createURL: (requestBody) => {
    return axios.post('https://182p0czopi.execute-api.us-east-2.amazonaws.com/default/mcity-go', requestBody)
  }
}
