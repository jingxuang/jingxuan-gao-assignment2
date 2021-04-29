const express = require('express');

const userRouter = express.Router();
const User = require('../models/user');
const passport = require('passport');
const authenticate = require('../authenticate');
// const { ExtractJwt } = require('passport-jwt');

// Need verify the admin 
userRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        User.find({})
            .then((users) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(users);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

userRouter.route('/signup')
    .post((req, res, next) => {

        console.log(req.body);

        User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
            if(err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({error: err});
                console.log(err);
            } else {
                // Save the user into the database
                user.save((err, user) => {
                    if(err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({error: err});
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, status: 'Regsitration successful!'});
                    });

                });
            }
        });
    });

userRouter.route('/login')
    .post(passport.authenticate('local'), (req, res) => {
        let token = authenticate.getToken({_id: req.user._id});

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            success: true,
            token: token,
            userId: req.user._id,
            status: 'Logged in successfully!'
        })
    });

userRouter.route('/logout')
    .post(authenticate.verifyUser, (req, res, next) => {

        console.log(req.user);
        if(req.user) {
            req.logout();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Logout successful!'});
        } else {
            let err = new Error("You're not logged in!");
            err.status = 403;
            next(err);
        }
    });

module.exports = userRouter;
