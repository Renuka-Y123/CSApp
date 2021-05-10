const {
  setAuthToken,
  getHashedPassword,
  authPassword,
  unsetAuthToken,
  authTokens
} = require('../controllers/auth')
const { connection } = require('../db/init_db')

module.exports = {
  logout: (req, res) => {
    //unsetAuthToken
    authTokens[req.cookies['AuthToken']] = ''
    res.clearCookie('user_id')
    res.redirect('/login')
  }
}
