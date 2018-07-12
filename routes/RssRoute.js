const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let response = require('../models/Response');
const Rss = require('../models/Rss');



router.get('/', (req, res, next) => {


    query = {};
    var options = {

        sort: { pubDate: -1 },
        lean: true,
        page: parseInt(req.query.page),
        limit: parseInt(req.query.take),
        offset: parseInt(req.query.skip),
    };

    const promise = Rss.paginate(query, options);
    promise.then((data) => {
        if (data.length === 0) {


            res.status(400).json(response.setError(99, null, 'Rss list is empty'));
        } else {

            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Rss service error.'))

    });

});

//select by id
router.get('/:id', (req, res, next) => {

    const promise = Rss.findById(req.params.id);

    promise.then((data) => {
        if (!data) {


            next(res.json(response.setError(99, null, 'The Rss was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Rss service error.'));

    });
});



// insert
// router.post('/', (req, res, next) => {

//     console.log(req.body);
//     req.body._id = new mongoose.Types.ObjectId();

//     const myURL = url.parse(req.body.url);
//     req.body.sourceName= myURL.host;

//     const Rss = new Rss(req.body);
//     const promise = Rss.save();

//     promise.then((data) => {

//         res.json(response.setSuccess(data));

//     }).catch((err) => {

//         res.json(response.setError(err.statusCode, err.message, 'Rss service error.'));

//     });
// });


//update Rss
router.put('/', (req, res, next) => {
    console.log(req.body);
    let options = { runValidators: true, new: true };
     

    const promise = Rss.findByIdAndUpdate(
        req.body._id,
        req.body,
        options
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The Rss was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Rss service error.'));
    });
});


//delete
router.delete('/', (req, res, next) => {
    const promise = Rss.findOneAndRemove({ "_id": req.body._id });

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The Rss was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Exchange service error.'));
    });
});


module.exports = router;