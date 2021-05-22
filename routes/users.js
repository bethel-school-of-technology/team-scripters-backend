var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('./models/user')


// route for user registration (add User) -> /register
router.post('/register', async (req,res,next) => {
 try{
   console.log(req.body)
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: eq.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      userName: req.body.userName,
      password: req.body.password
    });
    console.log(newUser)
 }
 catch(err){

 }
})


// route for login -> /login
router.post('/login', async (req,res,next) => {

})

// route to get user profile information -> /profile
router.post('/profile', async (req,res,next) => {

})

module.exports = router;
