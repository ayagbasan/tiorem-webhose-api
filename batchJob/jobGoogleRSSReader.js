const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
var moment = require('moment')
let Parser = require('rss-parser');
let parser = new Parser();
var url = require('url');
const config = require('../config');
const logger = require('../helper/logger');
const GoogleRss = require('../models/GoogleRss');

/*
Google RSS haberlerini okur
*/
var jobGoogleRss = {
    cron: null,
    settings: null,
    initialize: function (settingsDB) {

        jobGoogleRss.settings = settingsDB;
        jobGoogleRss.cron = new CronJob({
            cronTime: jobGoogleRss.settings.periode,
            onTick: function () {
                try {
                    jobGoogleRss.start();

                } catch (error) {
                    logger.addLog(jobGoogleRss.settings.jobName, "Error", error);
                }
            },
            onComplete: function () {
                console.log("job bitti");
            },
            start: jobGoogleRss.settings.start,
            runOnInit: jobGoogleRss.settings.runOnInit,

        });

    },
    stop: function () {
        if (jobGoogleRss.cron != null) {
            console.log(jobGoogleRss.settings.jobName, "stopped");
            jobGoogleRss.cron.stop();

        }
    },

    getJobStatus: function () {
        return jobGoogleRss.cron;
    },

    start: () => {

        (async () => {

            let feed = await parser.parseURL('https://news.google.com/rss?ned=tr_tr&gl=TR&hl=tr');


            var success = 0, error = 0;
            for (let i = 0; i < feed.items.length; i++) {

                try {
                    feed.items[i]._id = new mongoose.Types.ObjectId();
                    feed.items[i].clusterId = jobGoogleRss.getClusterId(feed.items[i].guid);
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


            logger.addLog(jobGoogleRss.settings.jobName, "GoogleRss-Read", "Success");
           // config.update_timestamp( jobGoogleRss.settings, new Date(), jobGoogleRss.cron.nextDates());

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

module.exports = jobGoogleRss;


