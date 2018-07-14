const mongoose = require('mongoose');

let crud = {

    collectionName: "googlersses",

    select: function (id) {

        console.log(collectionName);
        const schema = require("../models/GoogleRss").schema;
        const model = mongoose.model(this.collectionName, schema);

        const promise = new Promise((resolve, reject) => {
            resolve(model.findById(id));
        });

        return promise.then((data) => {
            return data;
        }).catch((err) => {
            console.error(err);
        });





    }


};


module.exports = crud;