const mysql = require('mysql')
const config = require('./config')

const connection = mysql.createConnection(config)

// // todo: create the users table (in case none exists)
// const createUsersTable = ``;

// // todo: create schedules table (in case none exists)
// const createSchedulesTable = ``;

connection.connect(err => {
  if (err) {
    console.log('Error connecting to DB.')
    return
  }

  // connection.query(createUsersTable, (err, rows) => {
  //   if (err) throw err;
  // });
  // connection.query(createSchedulesTable, (err, rows) => {
  //   if (err) throw err;
  // });
})

module.exports = {
  connection: connection
}
