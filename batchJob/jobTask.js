const config = require('../config');
const CronJob = require('cron').CronJob;
const logger = require('../helper/logger');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const webhoseio = require('webhoseio');

var jobTask = {

    start: () => {



        new CronJob({
            cronTime: config.job_periode,
            onTick: function () {
                try {


                    console.log("Get last timestamp: ", config.last_timestamp, " Next Job Runtime", this.nextDates());
                    jobTask.run(config.last_timestamp);

                } catch (error) {
                    logger.addLog("Cron Job", "WebHose-Job-Error", error);
                }
            },
            onComplete: function () {
                console.log("job bitti");
            },
            start: true,
            runOnInit: false,
        });

    },

    run: (timestamp) => {

        const client = webhoseio.config({ token: config.api_secret_key });

        let query = client.query('filterWebContent', {
            q: config.search_query,
            size: 100,
            ts: timestamp
        });



        query.then(output => {
            output['posts'].map(post => saveDatabase(post));

            console.log("Post", "WebHose-Read", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
            logger.addLog("Post", "WebHose-Read", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
            config.update_timestamp(new Date().getTime());
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

module.exports = jobTask;


