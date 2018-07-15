const CronJob = require('cron').CronJob;
var moment = require('moment');
const logger = require('../helper/logger');
const rss = require('../models/Rss');
const googleRss = require('../models/GoogleRss');
var moment = require('moment')

/*
RSS kaynaklarından (createdAt>now-1 saat) gelen haberlerin linklerini s
Google RSS haberlerinde var/yok kontrolünü yapar. Var olan haberlerin newsId ve relatedId değelerini updated eder
*/
var jobMapping = {
    cron: null,
    jobName: "Mapping Job",
    settings: null,
    initialize: function (settingsDB) {

        jobMapping.settings = settingsDB;
        jobMapping.cron = new CronJob({
            cronTime: jobMapping.settings.periode,
            onTick: function () {
                try {

                    console.log(jobMapping.settings.jobName, "started. Next Job Runtime", this.nextDates());

                    jobMapping.start();

                } catch (error) {
                    logger.addLog(jobMapping.settings.jobName, "Error", error);

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
        if (jobMapping.cron != null) {
            console.log(jobMapping.settings.jobName, "stopped");
            jobMapping.cron.stop();

        }
    },

    getJobStatus: function () {
        return jobMapping.cron;
    },

    start: () => {

        let today = moment().startOf('day')
        let tomorrow = moment(today).endOf('day')
        try {
            let promise = rss.aggregate(
                [
                    {
                        "$match": {
                            "createdAt": {
                                $gte: today.toDate(),
                                $lt: tomorrow.toDate()
                            },
                            "relatedId":
                            {
                                $eq: ""
                            }
                        }
                    },
                    {
                        "$lookup": {
                            "from": "googlersses",
                            "localField": "link",
                            "foreignField": "link",
                            "as": "google"
                        }
                    },
                    { "$unwind": { path: "$google", preserveNullAndEmptyArrays: false } },
                    {
                        "$project":
                        {
                            "Google_Id": "$google._id",
                            "Google_NewsId": "$google.newsId",
                            "Google_RelatedId": "$google.relatedId",
                            "RSS_Id": "$_id",
                            "RSS_RelatedId": "$relatedId"
                        }
                    },
                    { $sort: { createdAt: -1 } }

                ]);

            promise.then((rssData) => {
                console.log("rssData", rssData);
                let options = { runValidators: true, new: true };
                for (const item of rssData) {

                    const promiseUpdate = rss.findByIdAndUpdate(
                        item.RSS_Id,
                        {
                            relatedId: item.Google_RelatedId,
                        },
                        options
                    );

                    promiseUpdate.then((data) => {
                        console.log("RSS_Id", item.RSS_Id, "mapped");

                    }).catch((err) => {
                        logger.addLog(jobMapping.settings.jobName, "Error-RSS Id" + item.RSS_Id, error);
                    });


                }



            }).catch((error) => {

                logger.addLog(jobMapping.settings.jobName, "Error-RSS Data cannot read", error);
            });

        } catch (error) {
            logger.addLog(jobMapping.settings.jobName, "Error-Unknown", error);
        }



    }

}

module.exports = jobMapping;


