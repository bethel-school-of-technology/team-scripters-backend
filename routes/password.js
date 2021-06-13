var express = require('express');
const { route } = require('.');
var router = express.Router();
var User = require('../models/users')

var tokenService = require('../services/auth');
var passwordService = require('../services/password');


router.get('/profile', async (req, res, next) => {
    //console.log(req.headers);
    let myToken = req.headers.authorization;
    console.log(myToken);

    if (myToken) {
        let currentUser = await tokenService.verifyToken(myToken);
        console.log(currentUser);

        if (currentUser) {
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


router.put("/edit-password", ensureAuthenticated, (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    const userID = req.user._id;
    let errors = [];
    //Check required fields
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        errors.push({ msg: "Please fill in all fields." });
    }

    //Check passwords match
    if (newPassword !== confirmNewPassword) {
        errors.push({ msg: "New passwords do not match." });
    }

    //Check password length
    if (newPassword.length < 6 || confirmNewPassword.length < 6) {
        errors.push({ msg: "Password should be at least six characters." });
    }

    if (errors.length > 0) {
        res.json({
            errors,
            name: req.user.name,
        });
    } else {
        //VALIDATION PASSED
        //Ensure current password submitted matches
        User.findOneAndUpdate({ _id: userID }).then(user => {
            //encrypt newly submitted password
            bcrypt.compare(currentPassword, user.password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    //Update password for user with new password
                    bcrypt.genSalt(10, (err, salt) =>
                        bcrypt.hash(newPassword, salt, (err, hash) => {
                            if (err) throw err;
                            user.password = hash;
                            user.save();
                        })
                    );
                    res.json({
                        message: "password successfuly updated",
                        status: 200
                    })
                } else {
                    //Password does not match
                    errors.push({ msg: "Current password is not a match." });
                    res.json({
                        errors,
                        name: req.user.name,
                        message: "current password is not match"
                    });
                }
            });
        });
    }
});


