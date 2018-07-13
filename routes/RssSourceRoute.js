const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let response = require('../models/Response');
const RssSource = require('../models/RssSource');
var url = require('url');


router.get('/', (req, res, next) => {


    query = {};
    var options = {

        sort: { sourceName: 1 },
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
    req.body.sourceName = myURL.host;

    const rssSource = new RssSource(req.body);
    const promise = rssSource.save();

    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'RssSource service error.'));

    });
});

//insert Multi
router.post('/import', (req, res, next) => {

    if (req.body.Data && req.body.Data.length > 0) {

        for (const iterator of req.body.Data) {
            iterator._id = new mongoose.Types.ObjectId();
            iterator.sourceName = url.parse(iterator.url).host;
        }

        
        RssSource.insertMany(req.body.Data, { ordered: false })
            .then(function (mongooseDocuments) {
                let message = ("FULL INSERT " +
                    "Total items:" + " " + req.body.Data.length + " " +
                    "New items:" + " " + (req.body.Data.length) + " " +
                    "Duplicate items" + " 0");

                res.json(response.setSuccess(message));
            })
            .catch(function (err) {

                if (err.writeErrors) {
                    let type = "PARTIAL INSERT ";
                    if (err.writeErrors.length === req.body.Data.length)
                        type = "FULL DUPLICATE ";

                    let message = (type + " " +
                        "Total items:" + " " + req.body.Data.length + " " +
                        "New items:" + " " + (req.body.Data.length - err.writeErrors.length) + " " +
                        "Duplicate items" + " " + err.writeErrors.length);

                    res.json(response.setSuccess(message));

                } else {
                    res.json(response.setError(err.statusCode, err.message, 'RssSource service error.'));
                }
            });

    } else {
        res.json(response.setError("Liste boş ya da yok"));
    }
});


//update RssSource
router.put('/', (req, res, next) => {
    console.log(req.body);
    let options = { runValidators: true, new: true };
    const myURL = url.parse(req.body.url);
    req.body.sourceName = myURL.host;

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