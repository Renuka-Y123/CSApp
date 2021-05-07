const {
  setAuthToken,
  getHashedPassword,
  authPassword,
  unsetAuthToken,
  authTokens
} = require('../controllers/auth')
const { connection } = require('./init_db')
const qry = require('./queries')



module.exports.User = {
  // function 1: call to db to get user info by passing their id
  getUserById: async (uid)=>{ console.log(uid)
        var userRec =[]
        const query = new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM CSAppDB.users WHERE user_id = ?',
        [uid],
        (err, row) => {
          if (err) throw err
          console.log('Data received from Db:')
          userRec = row[0]
          resolve()
        })
    })
    await query
    console.log(userRec)
    return userRec
  },
  // function 2: auth the user (for login)
  login: async (req, res) => {
    var { email, password } = req.body

    var userRec = await qry.getUserByEmail(email)
    var isValRes
    isValidPass = new Promise((resolve, reject) => {
      isValRes = authPassword(userRec.password, password)
      resolve(isValRes)
    })
    await isValidPass

    if (userRec) {
      if (email === userRec.email && isValRes) {
        let token = setAuthToken(userRec.user_id)
       
        // return the JWT token for the future API calls
       res.cookie('AuthToken', token);
       res.setHeader('Authorization', 'Bearer '+ token); 
        res.redirect('/schedule');
        return;
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
  },

  logout: (req, res) => {
    unsetAuthToken
    res.clearCookie("user_id");
    res.redirect("/login");
  },

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
        })
    })
    await query
    //get userRec if user exists
    // var user = []
    // user = qry.getUserByEmail(req.body.email)
    if (userRec) {
      res.render('login', {
        message: 'User already registered. Please login',
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
      connection.query('insert into CSAppDB.users set ?', newUser, function (err,result) {
        if (err) {
          console.error(err)
          return
        } else {
          res.render('login', {
            message: 'Registration Complete. Please login to continue.',
          })
        }
        resolve()
      })
    })
    await query
  }
}

module.exports.Schedule = {
  // function 1: get all schedules
  getAllSchedules: async (req, res) => {
    try{
    var dbSchedule =[];
    query = new Promise((resolve, reject) => {
      connection.query(
      "SELECT users.firstname,users.surname,day, TIME_FORMAT(start_time,'%h:%i') start_time, TIME_FORMAT(end_time, '%h:%i') end_time FROM CSAppDB.schedules LEFT JOIN CSAppDB.users ON CSAppDB.schedules.user_id = CSAppDB.users.user_id",
            (err, rows) => {
              if (err) throw err
              console.log('Data received from Db:')
              rows.forEach(row => {
                dbSchedule.push(row)
              })
              resolve();
            })
           
  })
  await query
return dbSchedule
} catch (error) {
  console.log(error)
}
 
},
  // function 2: get all schedules for logged in user
  // function 3: create new schedule entry
  addSchedules: (req, res) => {
    const date = new Date(req.body.day)
    const day = date.getDay()
    var newSchedule = {
      user_id: req.user,
      day: day,
      start_time: req.body.start_time,
      end_time: req.body.end_time
    }
    // Update db
    var query = connection.query(
      'insert into schedules set ?',
      newSchedule,
      function (err, result) {
        if (err) {
          console.error(err)
          return
        } else {
          //newSchedule.day = qry.dayOfWeekAsString(parseInt(newSchedule.day))
         // schs.push(newSchedule)
          res.redirect('/schedule')
        }
      }
    )
  }
}
