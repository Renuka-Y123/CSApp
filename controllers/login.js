const {
  setAuthToken,
  getHashedPassword,
  authPassword
} = require('../controllers/auth')
const user = require('../controllers/users')

module.exports = {
  // function : auth the user (for login)
  login: async (req, res) => {
    var { email, password } = req.body
    var userRec = await user.getUserByEmail(email)
    var isValRes
    isValRes = await authPassword(userRec.password, password)
  
    if (userRec) {
      if (email === userRec.email && isValRes) { 
        let token = setAuthToken(userRec.user_id)
        // return the JWT token for the future API calls
        res.cookie('AuthToken', token)
        req.cookies.user_id = userRec.user_id
        res.setHeader('Authorization', 'Bearer ' + token)
        return res.redirect('/schedule')
      } else {
        res.status(403).render('login', {
          message: 'Incorrect username or password'
        })
      }
    } else {
      res.status(400).render('login', {
        message: 'Authentication failed! Please check the request'
      })
    }
  }
}
