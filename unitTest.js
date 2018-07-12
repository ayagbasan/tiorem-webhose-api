const CronJob = require('cron').CronJob;
const reader = require('./business/RssReader');
const RssSource = require('./models/RssSource');



let unitTest = {
    cron: null,
    startJob: () => {

        unitTest.cron = new CronJob({
            cronTime: "00 * * * * *",
            onTick: function () {
                try {

                    console.log("Rss reader job started...")
                    unitTest.run();

                } catch (error) {
                    logger.addLog("Cron Job", "unitTest-Job-Error", error);
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
        if (unitTest.cron != null) {
            unitTest.cron.stop();
        }
    },

    getStatus: () => {
        return unitTest.cron;
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

            console.log(3, err);

        });



    }
};


module.exports = unitTest;

