const CronJob = require('cron').CronJob;
const logger = require('../helper/logger');

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

                    console.log(jobMapping.settings.jobName,"started. Next Job Runtime", this.nextDates());
                    jobMapping.start();

                } catch (error) {
                    logger.addLog(jobMapping.settings.jobName, "Error", error);
                }
            },
            onComplete: function () {
                console.log("job bitti");
            },
            start: jobMapping.settings.autoStart,
            runOnInit: jobMapping.settings.runOnInit,

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

       

    }

}

module.exports = jobMapping;


