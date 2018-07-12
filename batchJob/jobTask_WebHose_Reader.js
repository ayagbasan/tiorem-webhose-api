const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
const webhoseio = require('webhoseio');
const config = require('../config');
const logger = require('../helper/logger');
const Post = require('../models/Post');

var jobTask_WebHose_Reader = {

    cron: null,
    start: () => {


        jobTask_WebHose_Reader.cron = new CronJob({
            cronTime: config.Data.WebHose.periode,
            onTick: function () {
                try {
                    console.log("jobTask_WebHose_Reader Get last timestamp: ", config.Data.WebHose.lastTimestamp, " Next Job Runtime", this.nextDates());
                    jobTask_WebHose_Reader.run();

                } catch (error) {
                    logger.addLog("Cron Job", "WebHose-Job-Error", error);
                }
            },
            onComplete: function () {
                console.log("job bitti");
            },
            start: true,
            runOnInit: true,

        });

    },

    stop: () => {
        if (jobTask_WebHose_Reader.cron != null) {
            jobTask_WebHose_Reader.cron.stop();
        }
    },

    getStatus: () => {
        return jobTask_WebHose_Reader.cron;
    },

    run: () => {

        const client = webhoseio.config({ token: config.Data.WebHose.apiSecretKey });

        let query = client.query('filterWebContent', {
            q: config.Data.WebHose.searchQuery,
            size: config.Data.WebHose.maxQueryLimit,
            ts: config.Data.WebHose.lastTimestamp,
        });



        query.then(output => {
            output['posts'].map(post => saveDatabase(post));

            console.log("Post", "WebHose-Read", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
            logger.addLog("Post", "WebHose-Read", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
            config.update_timestamp(new Date(), "jobTask_WebHose_Reader", jobTask_WebHose_Reader.cron.nextDates());
        });



        let saveDatabase = (item) => {

            try {

                item._id = new mongoose.Types.ObjectId();
                const post = new Post(item);
                const promise = post.save();
                promise.then((data) => {

                }).catch((err) => {

                    logger.addLog("Post", "Error Post Saved to Database", err);

                });
            } catch (error) {
                logger.addLog("Post", "Error saveDatabase function ", error);
            }
        };

    }
}

module.exports = jobTask_WebHose_Reader;


