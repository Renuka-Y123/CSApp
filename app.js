var createError = require('http-errors');
var express = require('express');
var app = express();

var cookieParser = require('cookie-parser');
var session = require("express-session");
const crypto = require('crypto');
const routes = require('./routes');

const { authTokens } = require('./controllers/auth')

// view engine setup
var path = require('path');
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

var logger = require('morgan');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));

// initialize express-session to track the logged-in user across sessions.
// app.use(session({
//               key: "user_id",
//               secret: "itisasecret",
//               resave: false,
//               saveUninitialized: false,
//               cookie: {
//                 expires: 600000,
//               },
//             })
// );

// // This middleware will check if user's cookie is still saved in browser and user is not set, then automatically logout - possible when you stop server after login your cookie still remains saved in the browser.
// app.use((req, res, next) => {
//   if (req.cookies.user_id && !req.session.user) {
//    res.clearCookie("user_id");
//     // if (req.cookies.user_id && req.session.user) {
//     // res.redirect('/schedules');
//   }
//   next();
// });

app.use((req, res, next) => {
  const authToken = req.cookies['AuthToken'];
  req.user = authTokens[authToken];
  next();
});

app.use('/', routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("App listening at http://%s:%s", host, port)
})

module.exports = app;
