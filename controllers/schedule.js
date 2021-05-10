const {
  setAuthToken,
  getHashedPassword,
  authPassword,
  unsetAuthToken,
  authTokens
} = require('../controllers/auth')
const { connection } = require('../db/init_db')

module.exports = {
  // function 1: get all schedules
  getAllSchedules: async (req, res) => {
    try {
      var dbSchedule = []
      query = new Promise((resolve, reject) => {
        connection.query(
          "SELECT users.firstname,users.surname,day, TIME_FORMAT(start_time,'%h:%i') start_time, TIME_FORMAT(end_time, '%h:%i') end_time FROM CSAppDB.schedules LEFT JOIN CSAppDB.users ON CSAppDB.schedules.user_id = CSAppDB.users.user_id",
          (err, rows) => {
            if (err) throw err
            console.log('Data received from Db:')
            rows.forEach(row => {
              row.day = dayOfWeekAsString(parseInt(row.day))
              dbSchedule.push(row)
            })
            resolve()
          }
        )
      })
      await query
      return dbSchedule
    } catch (error) {
      console.log(error)
    }
  },
  // function 2: get all schedules for logged in user
  userSchedules: async (req, res) => {
    try {
      var dbSchedule = []
      console.log(req.user)
      query = new Promise((resolve, reject) => {
        connection.query(
          "SELECT users.firstname,users.surname,day, TIME_FORMAT(start_time,'%h:%i') start_time, TIME_FORMAT(end_time, '%h:%i') end_time FROM CSAppDB.schedules LEFT JOIN CSAppDB.users ON CSAppDB.schedules.user_id = CSAppDB.users.user_id WHERE CSAppDB.schedules.user_id = ?",
          [req.user],
          (err, rows) => {
            if (err) throw err
            console.log('Data received from Db:')
            rows.forEach(row => {
              row.day = dayOfWeekAsString(parseInt(row.day))
              dbSchedule.push(row)
            })
            resolve()
          }
        )
      })
      await query
      return dbSchedule
    } catch (error) {
      console.log(error)
    }
  },
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

function dayOfWeekAsString (dayIndex) {
  return [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ][dayIndex]
}
