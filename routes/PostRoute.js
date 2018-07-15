const express = require('express');
const mongoose = require("mongoose");
var Filtering = require('kendo-grid-filter-sequelize-converter');
const router = express.Router();
const response = require('../models/Response');
const WebHose = require('../models/WebHose');


router.get('/', (req, res, next) => {

     
    //[{"operator":"eq","value":true,"field":"isProcess"}]
    //console.log("orijinal ",req.query.filter);
    //var f = new Filtering();
    //var result = f.resolveFilter(req.query.filter);

    //console.log("Sonuc",result);

    query ={};
    var options = {
        select: '_id  uuid thread url ord_in_thread author published title language external_links rating entities crawled isProcess googleId relatedNewsId',
        sort: { published: -1 },
        lean: true,
        page: parseInt(req.query.page),
        limit: parseInt(req.query.take),
        offset: parseInt(req.query.skip),

    };

    const promise = WebHose.paginate(query, options);
    promise.then((data) => {
        if (data.length === 0) {
            res.status(400).json(response.setError(99, null, 'WebHose list is empty'));
        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'WebHose service error.'))

    });

});



router.get('/:id', (req, res, next) => {

    const promise = WebHose.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            res.status(400).json(response.setError(99, null, 'The WebHose was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'WebHose service error.'))

    });
});


router.put('/:id', (req, res, next) => {
    console.log(req.params.id, req.body);
    let opts = { runValidators: true, new: true };

    const promise = WebHose.findOneAndUpdate(
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
            res.status(400).json(response.setError(99, null, 'The WebHose was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'WebHose service error.'));
    });
});




router.put('/', (req, res, next) => {
    console.log(req.body);
    let opts = { runValidators: true, new: true };

    const promise = WebHose.findOneAndUpdate(
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
            res.status(400).json(response.setError(99, null, 'The WebHose was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'WebHose service error.'));
    });
});

router.delete('/:id', (req, res, next) => {

    const id = req.params.id;

    const promise = WebHose.remove({ _id: id });

    promise.then((data) => {
        if (!data) {
            res.status(400).json(response.setError(99, null, 'The WebHose was not found.'));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.status(400).json(response.setError(err.statusCode, err.message, 'WebHose service error.'));
    });
});


 

module.exports = router;