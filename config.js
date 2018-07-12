const mongoose = require('mongoose');
const Config = require('./models/Config');
const logger = require('./helper/logger');
const jobTask_WebHose_Reader = require('./batchJob/jobTask_WebHose_Reader');
const jobTask_GoogleRss_Reader = require('./batchJob/jobTask_GoogleRss_Reader');

let config = {

    _id: "5b47145574d6642da4c98361",
    environment: "PROD",
    token_secret_key: "5b47145574d6642da4c98361",
    Data: null,


    get: () => {

        const promise = Config.findById(config._id);

        promise.then((data) => {

            this.update_timestamp = config.update_timestamp;
            this.get = config.get;
            this.Data = data;

            console.log("Getting app variables", this.Data);

            if (data.GoogleRSS != null && data.GoogleRSS.status === 1) {
                console.log("GoogleRSS starting......");
                jobTask_GoogleRss_Reader.start();
            }


            if (data.WebHose != null && data.WebHose.status === 1) {
                console.log("WebHose starting......");
                jobTask_WebHose_Reader.start();
            }
            //console.log(this);
            //jobTask_WebHose_Reader.start();
            //jobTask_GoogleRss_Reader.start();
            logger.addLog("Config", "initialize", "OK");

        }).catch((err) => {
            logger.addLog("Config", "initialize", "ERROR" + err.message);
            console.log(err.statusCode, err.message, 'config service error.');

        });
    },

    update_timestamp: (datetime, jobType) => {

        let options = { runValidators: true, new: true };

        let whereClause = null;
        if (jobType === "jobTask_WebHose_Reader") {
            whereClause =
                {
                    "WebHose.$.lastTimestamp": datetime.getTime(),
                    "WebHose.$.lastRunTime": datetime
                };
        }
        else if (jobType === "jobTask_GoogleRss_Reader") {
            whereClause =
                {
                    "GoogleRss.$.lastTimestamp": datetime.getTime(),
                    "GoogleRss.$.lastRunTime": datetime
                };
        }

        const promise = Config.findByIdAndUpdate(
            this._id,
            whereClause,
            options
        );

        promise.then((data) => {
            this.Data = data;
            console.log("Update last timestamp for " + jobType + " : ", datetime.getTime());

        }).catch((err) => {
            console.log(err.statusCode, err.message, 'config service error. update last timestamp');

        });



    },



}



module.exports = config;