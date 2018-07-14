const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
let Parser = require('rss-parser');
let parser = new Parser();
var url = require('url');
const config = require('../config');
const logger = require('../helper/logger');
const GoogleRss = require('../models/GoogleRss');

var jobTask_GoogleRss_Reader = {
    cron: null,
    start: () => {


        jobTask_GoogleRss_Reader.cron = new CronJob({
            cronTime: config.Data.GoogleRSS.periode,
            onTick: function () {
                try {
                    console.log("jobTask_GoogleRss_Reader Get last timestamp: ", config.Data.GoogleRSS.lastTimestamp, " Next Job Runtime", this.nextDates());
                    jobTask_GoogleRss_Reader.run();

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
        if (jobTask_GoogleRss_Reader.cron != null) {
            jobTask_GoogleRss_Reader.cron.stop();
        }
    },

    getStatus: () => {
        return jobTask_GoogleRss_Reader.cron;
    },
    run: () => {

        (async () => {

            let feed = await parser.parseURL('https://news.google.com/rss?ned=tr_tr&gl=TR&hl=tr');


            var success = 0, error = 0;
            for (let i = 0; i < feed.items.length; i++) {

                try {
                    feed.items[i]._id = new mongoose.Types.ObjectId();
                    feed.items[i].clusterId = jobTask_GoogleRss_Reader.getClusterId(feed.items[i].guid);
                    feed.items[i].pubDate = new Date(feed.items[i].pubDate);
                    feed.items[i].source = url.parse(feed.items[i].link).host;
                    feed.items[i].newsId = feed.items[i].clusterId.substring(1, 14);
                    feed.items[i].relatedId = feed.items[i].clusterId.substring(15, 28);
                } catch (error) {

                }


            }


            GoogleRss.insertMany(feed.items, { ordered: false })
                .then(function (mongooseDocuments) {
                    console.log("FULL INSERT - reading completed from ", "Google RSS", feed.items.length);
                })
                .catch(function (err) {

                    if (err.writeErrors) {
                        let type = "PARTIAL INSERT";
                        if (err.writeErrors.length === feed.items.length)
                            type = "FULL DUPLICATE";

                        console.log(type, "reading completed from", "Google RSS",
                            "Total items:", feed.items.length,
                            "New items:", feed.items.length - err.writeErrors.length,
                            "Duplicate items", err.writeErrors.length);
                    } else {
                        console.log("reading completed from", "Google RSS", "unknown error", err);
                    }
                });


            console.log("GoogleRss", "GoogleRss-Read", "Success", feed.items.length, success, error);
            logger.addLog("GoogleRss", "GoogleRss-Read", "Success", feed.items.length, success, error);
            config.update_timestamp(new Date(), "jobTask_GoogleRss_Reader", jobTask_GoogleRss_Reader.cron.nextDates());

        })();

    },
    getClusterId: (guid) => {

        if (guid.indexOf("=") > -1) {
            let res = guid.split("=");
            if (res.length > 0)
                return res[res.length - 1];
            else
                return guid;
        }
        else
            return guid;

    }
}

module.exports = jobTask_GoogleRss_Reader;


