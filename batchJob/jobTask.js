const config = require('../config');
const CronJob = require('cron').CronJob;
const JobWebHose = require('./JobWebHose');
const logger = require('../helper/logger');



var jobTask = {

    start: () => {

       

        new CronJob({
            cronTime: config.job_periode,
            onTick: function () {
                try {


                    console.log("Get last timestamp: ", config.last_timestamp, " Next Job Runtime", this.nextDates());
                    JobWebHose.run(config.last_timestamp);
                    //config.update_timestamp(123);
                    


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

    }
}

module.exports = jobTask;


