const mongoose = require('mongoose');
const Log = require('../models/Log');

var logger = {

    addLog: function (className, title, comment) {

        try {
            const logItem =
            {
                _id: new mongoose.Types.ObjectId(),
                Title: title,
                Class: className,
                Comment: comment

            };

            const log = new Log(logItem);
            const promise = log.save();

            promise.catch((err) => {

                console.log("Error log not saved", className, title, comment, err);

            });



        } catch (error) {
            console.log("Error log unknown error", className, title, comment, error);
        }

    }

}



module.exports = logger;