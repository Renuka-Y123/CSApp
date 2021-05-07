
const { requireAuth, setAuthToken, unsetAuthToken, getHashedPassword, sessionChecker,reqAuth} = require("../controllers/auth");
const { User, Schedule } = require("../db/models");
const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');


  router.get("/", reqAuth,(req, res) => {
    res.render("login");
  }),

  router.get("/login", (req, res) => { 
    res.render("login");
  }),

  router.post("/login", User.login),


  router.get("/logout", 
      User.logout),

  router.get("/signup", (req, res) => {
    res.render("signup");
  })

   // if reg is valid, show a message and redirect to login
  router.post("/signup", body(['firstname','surname'])
  .trim()
  .isLength({ min: 3, max: 25})
  .withMessage('is empty.')
  .isAlpha().withMessage('must be in alphabetic characters. No spaces'),
  body('email').isEmail(),
  body('password').isLength({ min: 8 }), User.signUp),


  router.get("/user/:id", reqAuth,(req, res) => {
    const { id } = req.params;

    // if id is valid, get the schedule data linked to that id
  }),

  router.get("/schedule", reqAuth, async(req, res) => {
    var schs =  await Schedule.getAllSchedules();
    res.status(200).render('dbschedules', {
      schedules: schs,
     message: 'Authentication successful!',
     })
  }),

  router.post("/newSchedule", reqAuth, Schedule.addSchedules);

  router.get('/newSchedule', async function  (req, res) { 
    users = await User.getUserById(req.user); console.log(users)
    res.render('dbform_schedule', {
        users:users //to populate distinct users in dropdown options
        });
  })



module.exports = router