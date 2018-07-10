const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const response = require('../models/Response');
const Post = require('../models/Post');



router.get('/', (req, res, next) => {

    let skip = 1, itemLimit = 20;
    if (req.params.page)
    skip = parseInt(req.params.skip);
    if (req.params.limit)
        itemLimit = parseInt(req.params.limit);


    const promise = Post.find({}, { text: 0 }).skip(skip).limit(itemLimit);
    promise.then((data) => {
        if (data.length === 0) {
            res.status(400).json(response.setError(99, null, 'Post list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Post service error.'))

    });
});


router.get('/:id', (req, res, next) => {

    const promise = Post.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            res.status(400).json(response.setError(99, null, 'The post was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Post service error.'))

    });
});


router.put('/:id', (req, res, next) => {
    console.log(req.params.id, req.body);
    let opts = { runValidators: true, new: true };

    const promise = Post.findOneAndUpdate(
        {
            _id: req.params.id
        },
        {
            "title,": req.body.title
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The post was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Post service error.'));
    });
});

 


router.put('/', (req, res, next) => {
    console.log(req.body);
    let opts = { runValidators: true, new: true };

    const promise = Post.findOneAndUpdate(
        {
            _id: req.body._id
        },
        {
            "title": req.body.title
        },
        opts
    );

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The post was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Post service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = Post.remove({ _id: id });

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The post was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'Post service error.'));
    });
});


router.post('/runBatchJob/', (req, res, next) => {

    const jobTask = require('./batchJob/jobTask');
    jobTask.start();
    res.json(response.setSuccess("Job started"));


});


module.exports = router;