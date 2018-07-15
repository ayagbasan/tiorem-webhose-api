const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let response = require('../models/Response');
const Config = require('../models/Config');
const settings = require('../config');
const jobGoogleRSSReader = require('../batchJob/jobGoogleRSSReader');
const jobMapping = require('../batchJob/jobMapping');
const jobRssReader = require('../batchJob/jobRssReader');
const jobTranslate = require('../batchJob/jobTranslate');
const jobWebHoseReader = require('../batchJob/jobWebHoseReader');


router.post('/serviceStatus', (req, res, next) => {

    console.log(req.body);

    let serviceTag = req.body.job.jobTag;
    let term = req.body.Term;

    const promise = Config.findById(settings._id);

    promise.then((data) => {


        if (serviceTag === "GoogleRSS") {
            if (term === "start")
                jobGoogleRSSReader.initialize(data.GoogleRSS);
            else if (term === "stop")
                jobGoogleRSSReader.stop();
        }
        else if (serviceTag === "Mapping") {
            if (term === "start")
                jobMapping.initialize(data.Mapping);
            else if (term === "stop")
                jobMapping.stop();
        }
        else if (serviceTag === "RssSources") {
            if (term === "start")
                jobRssReader.initialize(data.RssSources);
            else if (term === "stop")
                jobRssReader.stop();
        }
        else if (serviceTag === "Translate") {
            if (term === "start")
                jobTranslate.initialize(data.Translate);
            else if (term === "stop")
                jobTranslate.stop();
        }
        else if (serviceTag === "WebHose") {
            if (term === "start")
                jobWebHoseReader.initialize(data.WebHose);
            else if (term === "stop")
                jobWebHoseReader.stop();
        }

    }).then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Config service error.'));

    });
});

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




//update Config
router.put('/:id', (req, res, next) => {
    console.log(req.body);
    let options = { runValidators: true, new: true };

     
    
    const promise = Config.findByIdAndUpdate(
        req.params.id,
        req.body.Data,
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