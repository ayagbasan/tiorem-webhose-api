const CronJob = require('cron').CronJob;
var moment = require('moment');
const logger = require('../helper/logger');
const rss = require('../models/Rss');
const translateApi = require('google-translate-api');

/*
RSS kaynaklarında translat edilecek haberleri en ye cevirir
*/
var jobTranslate = {
    cron: null,
    jobName: "Mapping Job",
    settings: null,
    initialize: function (settingsDB) {

        jobTranslate.settings = settingsDB;
        jobTranslate.cron = new CronJob({
            cronTime: jobTranslate.settings.periode,
            onTick: function () {
                try {

                    console.log(jobTranslate.settings.jobName, "started. Next Job Runtime", this.nextDates());

                    jobTranslate.start();

                } catch (error) {
                    logger.addLog(jobTranslate.settings.jobName, "Error", error);

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
        if (jobTranslate.cron != null) {
            console.log(jobTranslate.settings.jobName, "stopped");
            jobTranslate.cron.stop();

        }
    },

    getJobStatus: function () {
        return jobTranslate.cron;
    },

    start: () => {

        let today = moment().startOf('day');
        let tomorrow = moment(today).endOf('day');
        try {

            let promise = rss.find({ isTranslate: true, descriptionEn: "", createdAt: { $gte: today.toDate(), $lt: tomorrow.toDate() } }, { _id: 1, description: 1 });

            promise.then((rssData) => {
                //translate edilecek haberleri getir

                if (rssData.length > 0) {

                    let promises = [];
                    for (const item of rssData)
                        promises.push(translateApi(item.description, { to: 'en' }));

                    return { promises: promises, rssData: rssData };
                }
                else {
                    console.log("Not exist tranlated news");
                }

            }).then((data) => {
                //translate servisine gönder
                return Promise.all(data.promises)
                    .then((result) => {
                        return { translated: result, rssData: data.rssData };
                    });

            }).then((result) => {
                // sonucları update et
                for (let i = 0; i < result.translated.length; i++) {
                    rss.findOneAndUpdate({ "_id": result.rssData[i]._id }, { descriptionEn: result.translated[i].text }).exec();
                }

                console.log(r);
            }).catch((error) => {

                logger.addLog(jobTranslate.settings.jobName, "Error-RSS Data cannot read", error);
            });

        } catch (error) {
            logger.addLog(jobTranslate.settings.jobName, "Error-Unknown", error);
        }
    },

    translateEn: function (row) {
        return new Promise(function (resolve, reject) {
            // place here your logic
            // return resolve([result object]) in case of success
            // return reject([error object]) in case of error
        });
    }

}

module.exports = jobTranslate;


