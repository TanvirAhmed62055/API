const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrpyt = require('bcrypt'); // Importing bcrypt 
const jwt = require('jsonwebtoken'); // Importing Json Web Token

/* 
Here we will have two routes sign up and sign in but no log out because
since we dont store the informantion about logout so we dont store the information
weather the user is locked in or not. we cant log the user out route
*/

const User = require('../models/user'); // Importing user files from models folder


router.post('/signup', (req, res, next) => {

    User
        .find({email: req.body.email})
        .exec()
        .then(user => {
            /*
            Here we are saying that if the user already exist then return that 'User Already Exist' and dont move forward
            or else make a new signup account.
            */
            if (user.length >= 1) { 
                /* 
                We use lenght because the user variable is actually not going to be null if you dont find entried.
                It actually going to be an empty array.
                
                and if 1. If the array has 1 that means the user already exist.
                and if 2. If the array has 2 that means the user does not exist and we need to make an user
                */
                return res.status(409).json({
                    message: 'User Already Exist'
                });
            } else {
                bcrpyt.hash(req.body.password, 10, (err, hash) => { // The 10 represents the number of salt rounds
                    if(err){
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user // Here we are saving the user and then creating it as well
                            .save()
                            .then(result => {
                                console.log(result);
                                res.status(201).json({
                                    message: 'User has been created'
                                });
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                        }
                })
            }
        })
});


router.post('/login', (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            /*
            In this if condition we are saying that if the user array is less then 0 
            that means that there is no email found
            */
            if (user.length < 1){
                return res.status(401).json({
                    message: 'ACCESS DENIED'
                });
            }
            bcrpyt.compare(req.body.password, user[0].password, (err, result) => {

                /* 
                Here we are comparing the password and checking that if the password matches the 
                password given by the user and matches with the database.

                REMEMBER: 
                The bcrypt.compare does the comparisons because the password is hashed. So you cant unhash it manually
                so we let the bcrypt.compare do its work.
                */
                if(err){
                    return res.status(401).json({
                        message: 'ACCESS DENIED'
                    });
                }

                if(result){
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                        // This are the two value we are storing in JWT token
                    },
                    process.env.JWT_KEY, // Here we are telling that this is the private key
                    {
                        expiresIn: "1h" // Here we are saying how long the token should be valid
                    }
                    )
                    return res.status(401).json({
                        message: 'ACCESS GRANTED',
                        token: token
                        // If you can look at the https://jwt.io/ there you can information about the token.
                    });
                }

                res.status(401).json({
                    message: 'ACCESS DENIED'
                });

            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:userID', (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User has been deleted'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err  
            });
        })
});
module.exports = router;