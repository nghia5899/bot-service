const jwt = require('jsonwebtoken')
const { User } = require('../models/user')

let authService = {
  async getUser(name) {
    try {
      return new Promise((resolve, reject) => {
        User.find({name: name}, (err, data) => {
          if (err) return reject(err)
          return resolve(data[0])
        })
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async generateToken(payload, secretSignature, tokenLife) {
    try {
      return jwt.sign({payload}, secretSignature, {
        expiresIn: tokenLife,
        algorithm: "HS256",
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  async verifyToken(token, secretKey) {
    try {
      return jwt.verify(token, secretKey)
    } catch (e) {
      console.log(e)
      throw e
    }
  } 
}

module.exports = authService
