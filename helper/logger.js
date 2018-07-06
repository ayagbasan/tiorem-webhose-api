const mongoose = require('mongoose');
const Log = require('../models/Log');

var logger = {

    addLog: function (className,title, comment, totalResults,moreResultsAvailable,requestsLeft) {

        const log = new Log(
            {
                _id: new mongoose.Types.ObjectId(),
                Title: title,
                Class: className,
                Comment: comment,
                TotalResults: totalResults,
                MoreResultsAvailable: moreResultsAvailable,
                RequestsLeft: requestsLeft
            });

            log.save();
    }

}



module.exports = logger;