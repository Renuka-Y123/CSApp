const { requireAuth, sessionChecker, reqAuth } = require('../controllers/auth')

const user = require('../controllers/users')
const schedule = require('../controllers/schedule')
const login = require('../controllers/login')
const logout = require('../controllers/logout')
const signup = require('../controllers/signup')

const express = require('express')
const router = express.Router()

const { body, validationResult } = require('express-validator')
router.get('/', reqAuth, sessionChecker, (req, res) => {
  if (req.user) res.redirect('/schedule')
  else res.render('login')
}),
  router.get('/login', reqAuth, sessionChecker, (req, res) => {
    res.render('login')
  }),
  router.post('/login', login.login),
  router.get('/logout', logout.logout),
  router.get('/signup', (req, res) => {
    res.render('signup')
  })

// if reg is valid, show a message and redirect to login
router.post(
  '/signup',
  body(['firstname', 'surname'])
    .trim()
    .isLength({ min: 3, max: 25 })
    .withMessage('is empty.')
    .isAlpha()
    .withMessage('must be in alphabetic characters. No spaces'),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }),
  signup.signUp
),
  router.get('/user/:id', reqAuth, sessionChecker, (req, res) => {
    const { id } = req.params
    // if id is valid, get the schedule data linked to that id
    if (id == req.user) res.redirect('/schedule')
    else
    res.redirect('/login')
  }),
  
  router.get('/schedule', reqAuth, sessionChecker, async (req, res) => {
    var schs = await schedule.userSchedules(req, res)
    res.status(200).render('dbschedules', {
      schedules: schs,
      message: 'Authentication successful!'
    })
  }),
  router.post('/newSchedule', reqAuth, sessionChecker, schedule.addSchedules)

router.get('/newSchedule', async function (req, res) {
  users = await user.getUserById(req.user)
  console.log(users)
  res.render('dbform_schedule', {
    users: users
  })
})

module.exports = router
