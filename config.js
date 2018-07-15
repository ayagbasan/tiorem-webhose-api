const mongoose = require('mongoose');
const Config = require('./models/Config');
const logger = require('./helper/logger');
const jobGoogleRSSReader = require('./batchJob/jobGoogleRSSReader');
const jobMapping = require('./batchJob/jobMapping');
const jobRssReader = require('./batchJob/jobRssReader');
const jobTranslate = require('./batchJob/jobTranslate');
const jobWebHoseReader = require('./batchJob/jobWebHoseReader');

let config = {

    _id: "5b47145574d6642da4c98361",
    environment: "PROD",
    token_secret_key: "5b47145574d6642da4c98361",
    Data: null,


    get: function ()   {
        config.update_timestamp=this.update_timestamp;
        config.get=this.get;
        const promise = Config.findById(config._id);

        promise.then((data) => {

            
            config.Data = data;
           // config.token_secret_key = data.token_secret_key

            console.log("Getting app variables", config.Data);

            if (data.GoogleRSS != null && data.GoogleRSS.status === 1) {
                let settingsDB = data.GoogleRSS;
                console.log(settingsDB.jobName, "initializing......");
                jobGoogleRSSReader.initialize(settingsDB);
            }

            if (data.Mapping != null && data.Mapping.status === 1) {
                let settingsDB = data.Mapping;
                console.log(settingsDB.jobName, "initializing......");
                jobMapping.initialize(settingsDB);
            }

            if (data.RssSources != null && data.RssSources.status === 1) {
                let settingsDB = data.RssSources;
                console.log(settingsDB.jobName, "initializing......");
                jobRssReader.startJob();
            }

            if (data.Translate != null && data.Translate.status === 1) {
                let settingsDB = data.Translate;
                console.log(settingsDB.jobName, "initializing......");
                jobTranslate.initialize(settingsDB);
            }

            if (data.WebHose != null && data.WebHose.status === 1) {
                let settingsDB = data.WebHose;
                console.log(settingsDB.jobName, "initializing......");
                jobWebHoseReader.initialize(settingsDB);
            }


            logger.addLog("Config", "initialize", "OK");

        }).catch((err) => {
            logger.addLog("Config", "initialize", "ERROR" + err.message);
            console.log(err.statusCode, err.message, 'config service error.');

        });
    },

    update_timestamp: function (jobSettings, datetime, nexttime) {

        let options = { runValidators: true, new: true };

        let lastTimestampKey = jobSettings.Tag + ".lastTimestamp",
            lastRunTimeKey = jobSettings.Tag + ".lastRunTime",
            nextRunTimeKey = jobSettings.Tag + ".nextRunTime";

        let whereClause =
        {
            lastTimestampKey: datetime.getTime(),
            lastRunTimeKey: datetime,
            nextRunTimeKey: nexttime
        };

        const promise = Config.findOneAndUpdate(
            config.Data._id,
            whereClause,
            options
        );

        promise.then((data) => {
            config.Data = data;
            console.log(jobSettings.jobName, "Updated last timestamp", datetime.getTime());
            console.log(jobSettings.jobName, "Updated next run timestamp", datetime.getTime());

        }).catch((err) => {
            console.log(err.statusCode, err.message, 'config service error. update last timestamp');

        });

    },



}



module.exports = config;