const { getHashedPassword } = require('../controllers/auth')
const { connection } = require('../db/init_db')

module.exports = {
  // function 3: validate a new sign-up
  signUp: async (req, res) => {
    var userRec = []
    const query = new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM CSAppDB.users WHERE email = ?',
        [req.body.email],
        (err, row) => {
          if (err) throw err
          console.log('Data received from Db:')
          userRec = row[0]
          resolve()
        }
      )
    })
    await query
    //get userRec if user exists
    // var user = []
    // user = qry.getUserByEmail(req.body.email)
    if (userRec) {
      res.render('login', {
        message: 'User already registered. Please login'
      })
      return
    }
    var newUser = {
      firstname: req.body.firstname,
      surname: req.body.surname,
      email: req.body.email,
      password: await getHashedPassword(req.body.password)
    }
    query = new Promise((resolve, reject) => {
      connection.query('insert into CSAppDB.users set ?', newUser, function (
        err,
        result
      ) {
        if (err) {
          console.error(err)
          return
        } else {
          res.render('login', {
            message: 'Registration Complete. Please login to continue.'
          })
        }
        resolve()
      })
    })
    await query
  }
}
