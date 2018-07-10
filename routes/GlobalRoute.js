const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Models

var response = require('../models/Response');
const Account = require('../models/Account');
const AccountRoute = require('./AccountRoute');
const Config = require('../config');



router.post('/register', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const { _id, uuid, username, password, email } = req.body;

    if (password.length > 3) {
        bcrypt.hash(password, 10).then((hash) => {

            const account = new Account(
                {
                    _id,
                    uuid,
                    username,
                    password: hash,
                    email
                }
            );
            const promise = account.save();

            promise.then((data) => {

                data.password = "";
                res.json(response.setSuccess(data));

            }).catch((err) => {

                res.json(response.setError(err.statusCode, err.message, 'Account service error.'));

            });
        });
    } else {
        res.json(response.setError(99, "Password length must be greater then 3 character", 'Account service error.'));
    }


});

router.post('/authenticate', (req, res) => {
    const { username, password } = req.body;

    Account.findOne({
        username
    }, (err, user) => {
        if (err)
            res.json(response.setError(err.statusCode, err.message, 'Account service error.'));

        if (!user) {

            res.json(response.setError(99, "Authentication failed, user not found.", 'Account service error.'));

        } else {
            bcrypt.compare(password, user.password).then((result) => {
                if (!result) {
                    res.json(response.setError(99, "Authentication failed, wrong password.", 'Account service error.'));
                } else {
                    const payload =
                    {
                        username
                    };

                    const token = jwt.sign(payload, Config.token_secret_key,
                        {
                            expiresIn: 7200 // 12 saat
                        });
                    let options = { runValidators: true, new: true };
                    
                    const promise = Account.findByIdAndUpdate(
                        user._id,
                        {
                            lastLogin: new Date()
                        },
                        options
                    );

                    promise.then((data) => {
                        data.password = token;
                        res.json(response.setSuccess(data));
                    }).catch((err) => {
                        res.json(response.setError(err.statusCode, err.message, 'Account service error.'));
                    });

                    
                }
            });
        }
    });
});

router.post('/tokenCheck', (req, res) => {

    const token = req.headers['x-access-token'] || req.body.token || req.query.token

    if (token) {
        jwt.verify(token, Config.token_secret_key, (err, decoded) => {
            if (err) {
                res.json(response.setError(99, "Failed to authenticate token.", 'Account service error.'));
            } else {
                res.json(response.setSuccess(true));
            }
        });
    } else {
        res.json(response.setError(99, "No token provided.", 'Account service error.'));
    }
});


module.exports = router;