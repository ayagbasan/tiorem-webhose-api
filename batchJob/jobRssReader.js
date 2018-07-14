const CronJob = require('cron').CronJob;
const reader = require('../business/RssReader');
const RssSource = require('../models/RssSource');



let jobRssReader = {
    cron: null,
    startJob: () => {

        jobRssReader.cron = new CronJob({
            cronTime: "00 * * * * *",
            onTick: function () {
                try {

                    console.log("Rss reader job started...")
                    jobRssReader.run();

                } catch (error) {
                    logger.addLog("Cron Job", "jobRssReader-Job-Error", error);
                }
            },
            onComplete: function () {
                console.log("job bitti");
            },
            start: true,
            runOnInit: true,

        });

    },
    stopJob: () => {
        if (jobRssReader.cron != null) {
            jobRssReader.cron.stop();
        }
    },

    getStatus: () => {
        return jobRssReader.cron;
    },

    run: () => {
        var promiseSources = new Promise((resolve, reject) => {

            resolve(RssSource.find({ active: true }));

        });

        promiseSources.then((data) => {

            if (data.length === 0) {

                console.log("Aktif kaynak bulunmuyor");

            } else {

                for (let i = 0; i < data.length; i++) {
                    reader.read(data[i]);
                }
            }

        }).catch((err) => {

           // console.log(3, err);

        });



    }
};


module.exports = jobRssReader;

