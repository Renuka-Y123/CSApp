const { connection } = require('../db/init_db')
module.exports = {
  // function 1: call to db to get user info by passing their id
  getUserById: async uid => {
    var userRec = []
    const query = new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM CSAppDB.users WHERE user_id = ?',
        [uid],
        (err, row) => {
          if (err) throw err
          console.log('Data received from Db:')
          userRec = row[0]
          resolve()
        }
      )
    })
    await query
    console.log(userRec)
    return userRec
  },

  getUserByEmail: async email => {
    try {
      var userRec = []
      const query = new Promise((resolve, reject) => {
        connection.query(
          'SELECT * FROM CSAppDB.users WHERE email = ?',
          [email],
          (err, row) => {
            if (err) throw err
            console.log('Data received from Db:')
            userRec = row[0]
            resolve()
          }
        )
      })
      await query
      return userRec
    } catch (error) {
      console.log(error)
    }
  }
}
