const mongoose = require('mongoose');
const logger = require('./helper/logger');

const Config = require('./models/Config');
const RssCategory = require('./models/RssCategory');
const CategoryMapping = require('./models/CategoryMapping');

const jobCategory = require('./batchJob/jobCategory');
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
    CategoryMappingList: null,


    get: () => {

        const promise = Config.findById(config._id);

        promise.then((settings) => {
            // Okunacak statik listeleri oku
            console.log("Getting app variables", config);
            config.Data = settings;


            return CategoryMapping.find()
                .then((catList) => {
                    config.CategoryMappingList = catList;
                    return settings;
                })
                .catch((err) => {
                    logger.addLog("Config", "Static Cache", "ERROR" + err.message);
                    console.log("Static cache errror", err);
                    return settings;
                });




        }).then((data) => {

            // Servisleri BAŞLAT
            if (data.Category != null && data.Category.status === 1) {
                let settingsDB = data.Category;
                settingsDB.update_timestamp = config.update_timestamp;
                settingsDB.CategoryMappingList = config.CategoryMappingList;
                console.log(settingsDB.jobName, "initializing......");
                jobCategory.initialize(settingsDB);
            }

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

    update_timestamp: (job) => {

        try {


            let datetime = new Date();
            let options = { runValidators: true, new: true };


            let lastTimestampKey = job.settings.Tag + ".lastTimestamp",
                lastRunTimeKey = job.settings.Tag + ".lastRunTime",
                nextRunTimeKey = job.settings.Tag + ".nextRunTime";

            let whereClause =
            {
                lastTimestampKey: datetime.getTime(),
                lastRunTimeKey: datetime,
                nextRunTimeKey: job.cron.nextDates()
            };

            const promise = Config.findOneAndUpdate(
                config.Data._id,
                whereClause,
                options
            );

            promise.then((data) => {
                config.Data = data;
                console.log(job.settings.jobName, "Updated last timestamp", datetime.getTime());
                console.log(job.settings.jobName, "Updated next run timestamp", datetime.getTime());

            }).catch((err) => {
                console.log(err.statusCode, err.message, job.settings.jobName + ' - config service error. update last timestamp');

            });
        } catch (error) {
            console.log(error);
        }
    },



}



module.exports = config;