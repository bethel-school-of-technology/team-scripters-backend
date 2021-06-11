var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/users')

var tokenService = require('../services/auth');
var passwordService = require('../services/password');

// route for user registration (add User) -> /register
router.post('/register', async (req,res,next) => {

 try{
   console.log(req.body)
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: passwordService.hashPassword(req.body.password)
    });
    
    //console.log(newUser)
    let result = await newUser.save();
    //console.log(result);
    res.json({
      message: "User created successfuly",
      status: 200
    })
 }
 catch(err){
  console.log(err);
  res.json({
    message: "User not created successfully",
    status: 403,
  })
 }
})



// route for login -> /login
router.post('/login', async (req,res,next) => {
//console.log(req.body);
  User.findOne({username: req.body.username}, function(err, user){
if(err){
  console.log(err)
  res.json({
    message: "Error accessing database",
    status: 500
  });
}
console.log(user);
if(user){
    let passwordMatch = passwordService.comparePasswords(req.body.password, user.password);
    if(passwordMatch){
      //create the token
       let token = tokenService.assignToken(user);
       res.json({
         message: "Login successful",
         status: 200,
         token
       })
    }
    else{
      console.log("Wrong Password");
      res.json({
        message: "Wrong Password",
        status: 403
      });
    }
}
  else{
    res.json({
      message: "wrong username",
      status: 401,
    })
  }
});

})
// route to get user profile information -> /profile
router.get('/profile', async (req,res,next) => {
  //console.log(req.headers);
  let myToken = req.headers.authorization;
  console.log(myToken);

  if(myToken){
    let currentUser = await tokenService.verifyToken(myToken);
    console.log(currentUser);
   
    if(currentUser){
      let responseUser = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        username: currentUser.username,
        deleted: currentUser.deleted,
        admin: currentUser.admin,
        _id: currentUser._id
      }
      res.json({
        message: "user profile information",
        status: 200,
        user: responseUser
      })
    }
  else{
    res.json({
      message: "Token was invalid or expired",
      status: 403,
      })
    }
  }
  else{
    res.json({
      message: "no token received",
      status: 403,
    })
  }
})

//route to update users profile information
router.put('/edit-profile', async (req, res, next) => {
console.log(req.body)
  User.findOneAndUpdate({_id: req.body.id}, {
      $set: {
        firstName: req.body.data.firstName,
        lastName: req.body.data.lastName,
        email: req.body.data.email,
        username: req.body.data.username,
  } }, (error, data) => {
      if (error) {
          return next(error);
          console.log(error)
      } else {
          res.json(data)
          console.log('Profile updated successfully')
      }
  })
})
 


module.exports = router;
