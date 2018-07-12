const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let response = require('../models/Response');
const RssSource = require('../models/RssSource');
var url = require('url');


router.get('/', (req, res, next) => {


    query = {};
    var options = {

        sort: { url: -1 },
        lean: true,
        page: parseInt(req.query.page),
        limit: parseInt(req.query.take),
        offset: parseInt(req.query.skip),
    };

    const promise = RssSource.paginate(query, options);
    promise.then((data) => {
        if (data.length === 0) {


            res.status(400).json(response.setError(99, null, 'RssSource list is empty'));
        } else {

            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'RssSource service error.'))

    });

});

//select by id
router.get('/:id', (req, res, next) => {

    const promise = RssSource.findById(req.params.id);

    promise.then((data) => {
        if (!data) {


            next(res.json(response.setError(99, null, 'The RssSource was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'RssSource service error.'));

    });
});



// insert
router.post('/', (req, res, next) => {

    console.log(req.body);
    req.body._id = new mongoose.Types.ObjectId();

    const myURL = url.parse(req.body.url);
    req.body.sourceName= myURL.host;

    const rssSource = new RssSource(req.body);
    const promise = rssSource.save();

    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'RssSource service error.'));

    });
});


//update RssSource
router.put('/', (req, res, next) => {
    console.log(req.body);
    let options = { runValidators: true, new: true };
    const myURL = url.parse(req.body.url);
    req.body.sourceName= myURL.host;

    const promise = RssSource.findByIdAndUpdate(
        req.body._id,
        {
            url: req.body.url,
            sourceName: req.body.sourceName,
            category: req.body.category,
            updatedAt: new Date(),
            active: req.body.active
        },
        options
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The RssSource was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'RssSource service error.'));
    });
});


//delete
router.delete('/', (req, res, next) => {
    const promise = RssSource.findOneAndRemove({ "_id": req.body._id });

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The RssSource was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Exchange service error.'));
    });
});


module.exports = router;