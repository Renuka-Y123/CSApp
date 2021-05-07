const db = require('./init_db.js')
const crypto = require('crypto');


var dbSchedule = []
var userlist = []

// db.connection.query(
  
// "SELECT users.firstname,users.surname,day, TIME_FORMAT(start_time,'%h:%i') start_time, TIME_FORMAT(end_time, '%h:%i') end_time FROM CSAppDB.schedules LEFT JOIN CSAppDB.users ON CSAppDB.schedules.user_id = CSAppDB.users.user_id",
//       (err, rows) => {
//         if (err) throw err
//         console.log('Data received from Db:')
//         rows.forEach(row => {
//           row.day = dayOfWeekAsString(parseInt(row.day))
//           dbSchedule.push(row)
//           userlist.push(row.username)
//         })
//       }
//     )


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

async function getUserByEmail(email){
  try {
    var userRec = []
    const query = new Promise((resolve, reject) => {
      db.connection.query(
        'SELECT * FROM CSAppDB.users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) throw err
          console.log('Data received from Db:')
          userRec = row[0]
          resolve()
        })
    })
    await query
    return userRec
  } catch (error) {
    console.log(error)
  }
}



module.exports= {
  dbSchedule: dbSchedule,
  userlist: userlist,
 
}

module.exports.dayOfWeekAsString = dayOfWeekAsString;
module.exports.getUserByEmail = getUserByEmail;
