const mongoose = require('mongoose');
const Config = require('./models/Config');
const jobTask = require('./batchJob/jobTask');

let config = {

    _id: "5b3fd6edf3f74186ccd93411",
    environment: "PROD",
    last_timestamp: null,
    search_query: null,
    job_next_run: null,
    job_periode: "1",
    api_secret_key: null,

    get: () => {

        const promise = Config.findById(config._id);

        promise.then((data) => {


            if (data.last_timestamp === 1)
                data.last_timestamp = new Date().getTime() - (1000 * 60 * 10);


            this.last_timestamp = data.last_timestamp;
            this.search_query = data.search_query;
            this.job_next_run = data.job_next_run;
            this.job_periode = data.job_periode;
            this.api_secret_key = data.api_secret_key;
            this.get_last_timestamp = config.get_last_timestamp;
            this.update_timestamp = config.update_timestamp;
            console.log(this);

            jobTask.start();

        }).catch((err) => {

            console.log(err.statusCode, err.message, 'config service error.');

        });
    },

    update_timestamp: (last_timestamp) => {

        let options = { runValidators: true, new: true };
        const promise = Config.findByIdAndUpdate(
            this._id,
            {
                last_timestamp: last_timestamp
            },
            options
        ); 

        promise.then((data) => {
            this.last_timestamp = last_timestamp;
            console.log("Update last timestamp: ",last_timestamp);

        }).catch((err) => {
            console.log(err.statusCode, err.message, 'config service error. update last timestamp');

        });

      

    },

    get_last_timestamp: () => {

        const promise = Config.findById(config._id);

        promise.then((data) => {
            if (data.last_timestamp === 1)
                data.last_timestamp = new Date().getTime() - (1000 * 60 * 10);

            this.last_timestamp = data.last_timestamp;

        }).catch((err) => {

            console.log(err.statusCode, err.message, 'config service error.');

        });

    }

}



module.exports = config;