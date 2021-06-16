var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/users')

var tokenService = require('../services/auth');
var passwordService = require('../services/password');


router.get('/edit-password', async (req, res, next) => {
  //console.log(req.headers);
  let myToken = req.headers.authorization;
  console.log(myToken);

  if (myToken) {
    let currentUser = await tokenService.verifyToken(myToken);
    console.log(currentUser);

    if (currentUser) {
      let responseUser = {
        deleted: currentUser.deleted,
        admin: currentUser.admin,
        _id: currentUser._id,
        password: currentUser.passsword
      }
      res.json({
        message: "user profile information",
        status: 200,
        user: responseUser
      })
    }
    else {
      res.json({
        message: "Token was invalid or expired",
        status: 403,
      })
    }
  }
  else {
    res.json({
      message: "no token received",
      status: 403,
    })
  }
})





//Work in progress route 

router.put('/edit-password', async (req, res, next) => {
  console.log(req.body)

  let myToken = req.headers.authorization;
  console.log(myToken);

  if (myToken) {
    let currentUser = await tokenService.verifyToken(myToken);
    console.log(currentUser);

    if (currentUser) {
      User.findOne({ _id: currentUser._id }, function (err, user) {
        if (err) {
          console.log(err)
          res.json({
            message: "Error accessing database",
            status: 500
          });
        }
        console.log(user);
        if (user) {
          let passwordMatch = passwordService.comparePasswords(req.body.currentPassword, user.password);
          if (passwordMatch) {
            User.findOneAndUpdate({_id: currentUser._id}, { $set: { password: passwordService.hashPassword(req.body.newPassword) } }, (err,response) => {
              console.log(err)
              console.log(response)
    
              res.json({
                message: "Password update successful",
                status: 200
              })
            })
          }
          else {
            console.log("Current password does not match user password");
            res.json({
              message: "Current password does not match user password",
              status: 403
            });
          }
        }
        else {
          res.json({
            message: "wrong user id",
            status: 401,
          })
        }
      });
    }
    else {
      res.json({
        message: "Token was invalid or expired",
        status: 403,
      })
    }
  }
  else {
    res.json({
      message: "no token received",
      status: 403,
    })
  }

  

})

module.exports = router;