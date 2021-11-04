const axios = require('axios')

const httpclient = {
  get(url, query) {
    return new Promise((resolve, reject) => {
      axios.get(url, query)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  post(url, data, config) {
    return new Promise((resolve, reject) => {
      axios.post(url, data, config)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  }
}

module.exports = httpclient
