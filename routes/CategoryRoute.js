const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
let response = require('../models/Response');
const Category = require('../models/Category');
const RssSource = require('../models/RssSource');


router.get('/', (req, res, next) => {

    query = {};
    var options = {

        sort: { categoryName: -1 },
        lean: true,
        page: parseInt(req.query.page),
        limit: parseInt(req.query.take),
        offset: parseInt(req.query.skip),

    };

    const promise = Category.paginate(query, options);
    promise.then((data) => {
        if (data.length === 0) {
            res.status(400).json(response.setError(99, null, 'Category list is empty'));
        } else {

            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.status(400).json(response.setError(err.statusCode, err.message, 'Category service error.'))

    });

});


//select by id
router.get('/:id', (req, res, next) => {

    const promise = Category.findById(req.params.id);

    promise.then((data) => {
        if (!data) {

            next(res.json(response.setError(99, null, 'The Category was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));

    });
});



// insert
router.post('/', (req, res, next) => {

    console.log(req.body);
    req.body._id = new mongoose.Types.ObjectId();

    const category = new Category(req.body);
    const promise = category.save();

    promise.then((data) => {

        res.json(response.setSuccess(data));

    }).catch((err) => {

        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));

    });
});


//update Category
router.put('/', (req, res, next) => {
    console.log(req.body);
    let options = { runValidators: true, new: true };
    const promise = Category.findByIdAndUpdate(
        req.body._id,
        {
            url: req.body.url,
            categoryName: req.body.categoryName,
            updatedAt: new Date(),
            active: req.body.active
        },
        options
    );

    promise.then((data) => {
        if (!data) {
            next(res.json(response.setError(99, null, 'The Category was not found.')));

        } else {
            res.json(response.setSuccess(data));
        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));
    });
});


//delete
router.delete('/', (req, res, next) => {


    const promise = RssSource.find({ "category": req.body.categoryName });

    promise.then((data) => {

        console.log(data);
        if (data.length===0) {
            const promise2 = Category.findOneAndRemove({ "categoryName": req.body.categoryName });

            promise2.then((data2) => {
                if (!data2) {
                    next(res.json(response.setError(99, null, 'The Category was not found.')));

                } else {
                    res.json(response.setSuccess(data2));
                }
            }).catch((err) => {
                res.json(response.setError(err.statusCode, err.message, 'Category service error.'));
            });

        } else {
            res.json(response.setError(100, 'Bu kategoride RSS kaynakları bulunmaktadır.',"Foreign Key"));

        }
    }).catch((err) => {
        res.json(response.setError(err.statusCode, err.message, 'Category service error.'));
    });


});


module.exports = router;