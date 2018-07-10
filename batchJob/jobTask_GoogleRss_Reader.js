const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;
let Parser = require('rss-parser');
let parser = new Parser();
const xml2js = require('xml2js');

const config = require('../config');
const logger = require('../helper/logger');
const GoogleRss = require('../models/GoogleRss');

var jobTask_GoogleRss_Reader = {

    start: () => {

      
        new CronJob({
            cronTime: config.job_periode_GoogleRss,
            onTick: function () {
                try {
                    console.log("jobTask_GoogleRss_Reader Get last timestamp: ", config.last_timestamp_GoogleRss, " Next Job Runtime", this.nextDates());
                    jobTask_GoogleRss_Reader.run(config.last_timestamp_GoogleRss);

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

    run: (timestamp) => {

        (async () => {

            let feed = await parser.parseURL('https://news.google.com/rss?ned=tr_tr&gl=TR&hl=tr');
            

            var success = 0, error = 0;
            for (let i = 0; i < feed.items.length; i++) {

                feed.items[i]._id = new mongoose.Types.ObjectId(); 
                feed.items[i].clusterId = jobTask_GoogleRss_Reader.getClusterId(feed.items[i].guid); 
                /*let newNews = new GoogleRss(feed.items[i]);
                newNews.clusterId = jobTask_GoogleRss_Reader.getClusterId(newNews.guid);
                newNews._id = new mongoose.Types.ObjectId();               
                newNews.save(function (err) {
                    if (!err) {
                        success++;
                    } else {
                        error++;
                        console.log(err);
                    }

                });*/
            }


            GoogleRss.insertMany( feed.items,{ ordered: false })
                .then(function (mongooseDocuments) {
                    console.log("OK", mongooseDocuments);
                })
                .catch(function (err) {
                   // console.log("Error", err);
                });
                

            console.log("GoogleRss", "GoogleRss-Read", "Success", feed.items.length, success, error);
            logger.addLog("GoogleRss", "GoogleRss-Read", "Success", feed.items.length, success, error);
            config.update_timestamp(new Date().getTime(), "jobTask_GoogleRss_Reader");

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


