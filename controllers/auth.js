require('dotenv').config({ path: './.env' })

const { Console } = require('console')
const crypto = require('crypto')
const session = require('express-session')
const jwt = require('jsonwebtoken')
//const { get } = require('../routes')

const salt = 'Thisisasecret'
var iterations = 1000

// we store the tokens in-memory for simplicity's sake
// in production we'd make them persistent
const authTokens = {}
//const refreshTokens = []

const generateAuthToken = userId => {
  // return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, {
  // expiresIn: '10m'
  // })
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET)
}

module.exports = {
  setAuthToken: (userId, res) => {
    //let result = {}
    var accessToken = generateAuthToken(userId)
    authTokens[accessToken] = userId
    // result.accesstoken = accessToken
    return accessToken
  },

  unsetAuthToken: (req, res) => {
    //authTokens = authTokens.filter(token => token !== req.body.token)
    // refreshTokens = refreshTokens.filter(token => t !== token);
    authTokens[req.cookies['AuthToken']] = ''
  },

  getSessionUser: (req, res, next) => {
    const authToken = req.cookies['AuthToken']
    // Inject the user to the request
    req.user = authTokens[authToken]
    next()
  },

  sessionChecker: (req, res, next) => {
    if (req.session.user && req.cookies.user_id) {
      res.redirect('/schedule')
    } else {
      next()
    }
  },

  logout: (req, res, next) => {
    const { token } = req.body
    authTokens = authTokens.filter(token => t !== token)
    res.redirect('/login')
  },

  requireAuth: (req, res, next) => {
    const authHeader = req.headers['authorization']
    //const authHeader = req.headers.authorization
    console.log(authHeader)
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
      return res.json({
        success: false,
        message: 'Unauthorised access'
      })
    } //unauthorized access
    else {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          return res.json({
            success: false,
            message: 'Token is not valid'
          }) //invalid token
        }
        req.user = user
        next()
      })
    }
  },

  reqAuth: (req, res, next) => {
    //  const authToken = req.cookies['AuthToken'];
    //   req.user = authTokens[authToken];
    console.log(req.user)
    if (req.user) {
      next()
    } else {
      res.render('login', {
        message: 'Please login to continue',
        messageClass: 'alert-danger'
      })
    }
  },

  getHashedPassword: async password => {
    try {
      const hashpass = await crypto
        .pbkdf2Sync(password, salt, iterations, 64, 'sha512')
        .toString('base64')
      return hashpass
    } catch (error) {
      console.log(error)
    }
  },

  authPassword: async (savedHash, passwordAttempt) => {
    try {
      const hashchk = await crypto
        .pbkdf2Sync(passwordAttempt, salt, iterations, 64, 'sha512')
        .toString('base64')
      return savedHash == hashchk
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports.authTokens = authTokens
