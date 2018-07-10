const mongoose = require('mongoose');
const Config = require('./models/Config');
const logger = require('./helper/logger');
const jobTask_WebHose_Reader = require('./batchJob/jobTask_WebHose_Reader');
const jobTask_GoogleRss_Reader = require('./batchJob/jobTask_GoogleRss_Reader');

let config = {

    _id: "5b3fd6edf3f74186ccd93411",
    environment: "PROD",
    last_timestamp_WebHose: null,
    last_timestamp_GoogleRss: null,
    search_query: null,
    job_next_run: null,
    job_periode_GoogleRss: "1",
    job_periode_WebHose: "1",
    api_secret_key: null,
    token_secret_key: "5b3fd6edf3f74186ccd93411",

    get: () => {

        const promise = Config.findById(config._id);

        promise.then((data) => {


             
            if (data.last_timestamp_WebHose === 1)
                data.last_timestamp_WebHose = new Date().getTime() - (1000 * 60 * 10);

            if (data.last_timestamp_GoogleRss === 1)
                data.last_timestamp_GoogleRss = new Date().getTime() - (1000 * 60 * 10);


            this._id = "5b3fd6edf3f74186ccd93411";
            
            this.last_timestamp_WebHose = data.last_timestamp_WebHose;
            this.job_periode_WebHose = data.job_periode_WebHose;

            this.last_timestamp_GoogleRss = data.last_timestamp_GoogleRss;
            this.job_periode_GoogleRss = data.job_periode_GoogleRss;


            this.search_query = data.search_query;
            this.job_next_run = data.job_next_run;     

            this.api_secret_key = data.api_secret_key;
            this.get_last_timestamp = config.get_last_timestamp;
            this.update_timestamp = config.update_timestamp;
            this.token_secret_key = config.token_secret_key;

            //console.log(this);
            jobTask_WebHose_Reader.start();
            //jobTask_GoogleRss_Reader.start();
            logger.addLog("Config", "initialize", "OK");

        }).catch((err) => {
            logger.addLog("Config", "initialize", "ERROR" + err.message);
            console.log(err.statusCode, err.message, 'config service error.');

        });
    },

    update_timestamp: (last_timestamp,jobType) => {

        let options = { runValidators: true, new: true };

        let whereClause = null;
        if (jobType === "jobTask_WebHose_Reader") {
            whereClause = { last_timestamp_WebHose: last_timestamp };
        }
        else if (jobType === "jobTask_GoogleRss_Reader") {
            whereClause = { last_timestamp_GoogleRss: last_timestamp };
        }

        const promise = Config.findByIdAndUpdate(
            this._id,
            whereClause,
            options
        );

        promise.then((data) => {
            this.last_timestamp = last_timestamp;
            console.log("Update last timestamp for "+ jobType +" : ", last_timestamp);

        }).catch((err) => {
            console.log(err.statusCode, err.message, 'config service error. update last timestamp');

        });



    },

    get_last_timestamp: (jobType) => {

        const promise = Config.findById(config._id);

        promise.then((data) => {
            if (jobType === "jobTask_WebHose_Reader") {
                if (data.last_timestamp_WebHose === 1)
                    data.last_timestamp_WebHose = new Date().getTime() - (1000 * 60 * 10);
                this.last_timestamp_WebHose = data.last_timestamp_WebHose;
            }
            else if (jobType === "jobTask_GoogleRss_Reader") {
                if (data.last_timestamp_GoogleRss === 1)
                    data.last_timestamp_GoogleRss = new Date().getTime() - (1000 * 60 * 10);
                this.last_timestamp_GoogleRss = data.last_timestamp_GoogleRss;
            }

        }).catch((err) => {

            console.log(err.statusCode, err.message, 'config service error.');

        });

    }

}



module.exports = config;