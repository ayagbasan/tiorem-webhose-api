const webhoseio = require('webhoseio');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const logger = require('../helper/logger');
const config = require('../config');

let JobWebHose = {

    run: (timestamp) => {




        const client = webhoseio.config({ token: '8e1ba289-9e49-44c4-83b1-53f94dd2d311' });

        let prevMinute = 0;

        let query = client.query('filterWebContent', {
            q: config.search_query,
            size: 100,
            ts: timestamp
        });



        query.then(output => {
            output['posts'].map(post => saveDatabase(post));

            console.log("Post", "WebHose-Read", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
            logger.addLog("Post", "WebHose-Read", "Success", output.totalResults, output.moreResultsAvailable, output.requestsLeft);
            config.update_timestamp(new Date().getTime());
        });





        let saveDatabase = (item) => {

            try {

                item._id = new mongoose.Types.ObjectId();
                const post = new Post(item);
                const promise = post.save();
                promise.then((data) => {

                }).catch((err) => {

                    logger.addLog("Post", "Error Post Saved to Database", err);

                });
            } catch (error) {
                logger.addLog("Post", "Error saveDatabase function ", error);
            }
        };

    }

}



module.exports = JobWebHose;


