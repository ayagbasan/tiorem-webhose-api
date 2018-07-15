const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
const webhoseio = require('webhoseio');
const config = require('../config');
const logger = require('../helper/logger');
const WebHose = require('../models/WebHose');

/*
Web Hose kaynaklarından verileri oku
*/
var jobWebHoseReader = {
    cron: null,     
    settings: null,
    initialize: function (settingsDB) {

        jobWebHoseReader.settings = settingsDB;
        jobWebHoseReader.cron = new CronJob({
            cronTime: jobWebHoseReader.settings.periode,
            onTick: function () {
                try {

                    console.log(jobWebHoseReader.settings.jobName, "started. Next Job Runtime", this.nextDates());

                    jobWebHoseReader.start();

                } catch (error) {
                    logger.addLog(jobWebHoseReader.settings.jobName, "Error", error);

                }
            },
            onComplete: function () {
                console.log("job bitti");
            },
            start: true,
            runOnInit: true,

        });

    },
    stop: function () {
        if (jobWebHoseReader.cron != null) {
            console.log(jobWebHoseReader.settings.jobName, "stopped");
            jobWebHoseReader.cron.stop();

        }
    },

    getJobStatus: function () {
        return jobWebHoseReader.cron;
    },

    start: () => { 
        try {
             

            const client = webhoseio.config({ token: jobWebHoseReader.settings.apiSecretKey });

            let query = client.query('filterWebContent', {
                q:  jobWebHoseReader.settings.searchQuery,
                size:  jobWebHoseReader.settings.maxQueryLimit,
                ts:  jobWebHoseReader.settings.lastTimestamp,
            });
    
    
    
            query.then(output => {
                output['WebHoses'].map(WebHose => saveDatabase(WebHose));
    
                console.log( jobWebHoseReader.settings.jobName, "Reading", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
                logger.addLog(jobWebHoseReader.settings.jobName, "Reading", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
                config.update_timestamp(jobWebHoseReader.settings,  new Date(),  jobWebHoseReader.cron.nextDates());
            });
    
    
    
            let saveDatabase = (item) => {
    
                try {
    
                    item._id = new mongoose.Types.ObjectId();
                    const WebHose = new WebHose(item);
                    const promise = WebHose.save();
                    promise.then((data) => {
    
                    }).catch((err) => {
     
                        logger.addLog(jobWebHoseReader.settings.jobName, "Error webhose saved to database",err);
                    });
                } catch (error) {
                    logger.addLog(jobWebHoseReader.settings.jobName, "Error saveDatabase function",err);
                   
                }
            };
 

        } catch (error) {
            logger.addLog(jobWebHoseReader.settings.jobName, "Error-Unknown", error);
        }



    }

}

module.exports = jobWebHoseReader;


