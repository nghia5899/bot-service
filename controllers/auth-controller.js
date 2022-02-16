const {ResponseData} = require('../helpers/response-data')
const authService = require('../services/auth-service')

class AuthController {
  async login(req, res) {
    try {
      const username = req.body.username
      const password = req.body.password

      let user = await authService.getUser(username)
      if (!user) {
       return res.status(401).json(new ResponseData(false, "User name do not exist",).toJson())
      }
      
      const isPassWordValid = password === user.password
      if (!isPassWordValid) {
        return res.status(401).json(new ResponseData(false, "Password incorrect",).toJson())
      }

      const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '10m'
	    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

      const dataForAccessToken = {
        username: user.name
      }
      const accessToken = await authService.generateToken(dataForAccessToken, accessTokenSecret, accessTokenLife)
      if (!accessToken) {
        return res.status(401).json(new ResponseData(false, "Login failed",).toJson())
      }
      let data = {
        accessToken: accessToken
      }
      return res.json(new ResponseData(true, "", data).toJson()) 
    } catch (e) {
      console.log(e)
      return res.status(401).json(new ResponseData(false, "Login failed",).toJson())
    }
  }

  async isAuth(req, res, next) {
    try {
      const accessTokenFromHeader = req.headers.authorization
      if (!accessTokenFromHeader) {
        return res.status(401).json(new ResponseData(false, "Error in verify access token", data).toJson()) 
      }
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET 

      const verified = await authService.verifyToken(accessTokenFromHeader, accessTokenSecret)
      if (!verified) {
        return res.status(401).json(new ResponseData(false, "Error in verify access token", data).toJson()) 
      }
      
      const user = await authService.getUser(verified.payload.username)
      req.user = user

      return next()
    } catch (e) {
      console.log(e)
      return res.status(401).json(new ResponseData(false, "Error in verify access token",).toJson()) 
    }
  }
}

module.exports = new AuthController
