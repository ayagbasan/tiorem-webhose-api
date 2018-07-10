const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let response = require('../models/Response');
const Account = require('../models/Account');
//select by id
router.get('/:account_id', (req, res, next) => {

    const promise = Account.findById(req.params.account_id);

    promise.then((data) => {
        if (!data) {

            next(res.json(response.setError(99, null, 'The account was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Account service error.'));

    });
});

// insert
router.post('/', (req, res, next) => {

    req.body._id = new mongoose.Types.ObjectId();
    const account = new Account(req.body);
    const promise = account.save();

    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Account service error.'));

    });
});


//update Account
router.post('/updateAccount', (req, res, next) => {

    let options = { runValidators: true, new: true };
    const promise = Account.findByIdAndUpdate(
        req.body.userId,
        {
            active: req.body.active,
            alertSms: req.body.alertSms,
            alertNotification: req.body.alertNotification,
            alertEmail: req.body.alertEmail,
            phoneNumber: req.body.phoneNumber,
            surname: req.body.surname,
            name: req.body.name,
        },
        options
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The account was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Account service error.'));
    });
});


let updateLastLogin =(userId)=>{

    let options = { runValidators: true, new: true };
    const promise = Account.findByIdAndUpdate(
        userId,
        {
            lasLogin : new Date()
        },
        options
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The account was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Account service error.'));
    });
}

module.exports = router;