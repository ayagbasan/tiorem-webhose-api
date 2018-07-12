const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let response = require('../models/Response');
const Config = require('../models/Config');
//select by id
router.get('/:id', (req, res, next) => {

    const promise = Config.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            next(res.json(response.setError(99, null, 'The Config was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Config service error.'));

    });
});



// insert
router.post('/', (req, res, next) => {

    console.log(req.body);
    req.body._id = new mongoose.Types.ObjectId();
    req.body.WebHose._id = new mongoose.Types.ObjectId();
    req.body.GoogleRSS._id = new mongoose.Types.ObjectId();

    const config = new Config(req.body);
    const promise = config.save();

    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Config service error.'));

    });
});


//update Config
router.put('/:id', (req, res, next) => {
    console.log(req.body);
    let options = { runValidators: true, new: true };
    const promise = Config.findByIdAndUpdate(
        req.params.id,
        {
            GoogleRSS: req.body.Data.GoogleRSS,
            WebHose: req.body.Data.WebHose,
            
        },
        options
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The Config was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Config service error.'));
    });
});



module.exports = router;