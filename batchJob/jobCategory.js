const CronJob = require('cron').CronJob;
const moment = require('moment');
const logger = require('../helper/logger');
const rss = require('../models/Rss');
const language = require('@google-cloud/language');
const RssCategory = require('../models/RssCategory');
const Rss = require('../models/Rss');



/*
RSS kaynaklarından  gelen haberlerin categorileri belirlenir.
*/
var job = {


    cron: null,
    settings: null,
    initialize: function (settingsDB) {

        job.settings = settingsDB;
        job.cron = new CronJob({
            cronTime: job.settings.periode,
            onTick: function () {
                try {
                    console.log(job.settings.jobName, "started...");
                    job.start();

                }
                catch (error) {
                    logger.addLog(job.settings.jobName, "Error", error);
                }
            },
            onComplete: function () {
                console.log("job bitti");
            },
            start: job.settings.start,
            runOnInit: job.settings.runOnInit,

        });

    },
    stop: function () {
        if (job.cron != null) {
            console.log(job.settings.jobName, "stopped");
            job.cron.stop();
        }
    },

    getJobStatus: function () {
        return job.cron;
    },

    start: () => {


        let today = moment().startOf('day');
        let tomorrow = moment(today).endOf('day');

        try {

            let promise = rss.find({ isTranslate: true, googleCategoryStatus:0, createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() } }, { _id: 1, descriptionEn: 1 });

            promise.then((rssData) => {

                //category edilecek haberleri getir
                job.settings.update_timestamp(job);

                if (rssData.length > 0) {

                    let promises = [];
                    for (const item of rssData) {
                        const client = new language.LanguageServiceClient();
                        const document = { content: item.descriptionEn, type: 'PLAIN_TEXT' };
                        promises.push(client.classifyText({ document: document }));
                    }

                    return { promises: promises, rssData: rssData };
                }
                else {
                    console.log("Not exist categorized news");
                }
            }).then((data) => {
                //category servisine gönder
                return Promise.all(data.promises)
                    .then((result) => {
                        return { categorized: result, rssData: data.rssData };
                    });

            }).then((result) => {
                //sonucları update et
                for (let i = 0; i < result.categorized.length; i++) {

                    console.log(result.categorized[i]);
                    for (let j = 0; j < result.categorized[i].length; j++) {

                        let categoryItem = result.categorized[i][j].categories;
                        let insertItems = [];
                        let bestScore = -999;
                        let bestCategoryName = "";
                        for (let k = 0; k < categoryItem.length; k++) {

                            if (categoryItem[k].confidence > bestScore) {
                                bestScore = categoryItem[k].confidence;
                                bestCategoryName = categoryItem[k].name;
                            }

                            insertItems.push(
                                {
                                    rssNewsId: result.rssData[i]._id,
                                    categoryName: categoryItem[k].name,
                                    score: categoryItem[k].confidence
                                });
                        }

                        if (insertItems.length > 0) {
                            let tioremCategory = job.getTioremCategory(bestCategoryName);
                            RssCategory.insertMany(insertItems, { ordered: false });
                            Rss.findOneAndUpdate(
                                {
                                    _id: result.rssData[i]._id
                                },
                                {
                                    googleCategoryStatus: 1,
                                    googleCategory: bestCategoryName,
                                    tioremCategory: tioremCategory
                                },
                                { new: true }
                            ).exec();
                        }
                        else {
                            Rss.findOneAndUpdate(
                                {
                                    _id: result.rssData[i]._id
                                },
                                {
                                    googleCategoryStatus: 2,
                                    googleCategory: null,
                                    tioremCategory: null
                                })
                                .exec();;
                        }
                    }


                }


            }).catch((error) => {
                logger.addLog(job.settings.jobName, "Error-RSS Data cannot read", error);
            });

        } catch (error) {
            logger.addLog(job.settings.jobName, "Error-Unknown", error);
        }
    },

    translateEn: function (row) {
        return new Promise(function (resolve, reject) {
            // place here your logic
            // return resolve([result object]) in case of success
            // return reject([error object]) in case of error
        });
    },

    getTioremCategory: function (googleCategoryName) {

        let tioremCategory = googleCategoryName;
        for (const item of job.settings.CategoryMappingList) {
            if (item.googleCategoryName === googleCategoryName) {
                tioremCategory = item.tioremCategoryName;
                break;
            }
        }

        return tioremCategory;
    }

}

module.exports = job;


