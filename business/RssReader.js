let Parser = require('rss-parser');
const mongoose = require('mongoose');
const striptags = require('striptags');
let parser = new Parser();
const Rss = require('../models/Rss');
const logger = require('../helper/logger');

var rss = {

    read: (source) => {

        

        return (async () => {

            try {
                let feed = await parser.parseURL(source.url);




                for (let i = 0; i < feed.items.length; i++) {
                    try {
                        feed.items[i]._id = new mongoose.Types.ObjectId();
                        feed.items[i].category = source.category;
                        feed.items[i].source = source.sourceName;
                        feed.items[i].pubDate = new Date(feed.items[i].pubDate);

                        if (feed.items[i].content)
                            feed.items[i].description = feed.items[i].content;

                        feed.items[i].description = striptags(feed.items[i].description);


                    } catch (error) {
                        logger.addLog("RSS-Reader-ERROR-1", source.sourceName + "-" + source.category, error);
                    }
                }


                try {
                    Rss.insertMany(feed.items, { ordered: false })
                        .then(function (mongooseDocuments) {
                            let type = "FULL INSERT";
                            //console.log(type, "reading completed from ", source.sourceName, source.category);
                            //logger.addLog("RSS-Reader", source.sourceName + "-" + source.category, type);

                        })
                        .catch(function (error) {
                            if (error.writeErrors) {
                                let type = "PARTIAL INSERT";
                                if (error.writeErrors.length === feed.items.length)
                                    type = "FULL DUPLICATE";

                                // console.log(type, "reading completed from", source.sourceName, source.category,
                                //     "Total items:", feed.items.length,
                                //     "New items:", feed.items.length - err.writeErrors.length,
                                //     "Duplicate items", err.writeErrors.length);
                                // logger.addLog("RSS-Reader", source.sourceName + "-" + source.category, type);
                            } else {
                                //console.log("reading completed from", source.url, "unknown error", error);
                                //logger.addLog("RSS-Reader-ERROR-2", source.sourceName + "-" + source.category, error);
                            }

                        });
                } catch (error) {
                    logger.addLog("RSS-Reader-ERROR-3", source.sourceName + "-" + source.category, error);
                }

            } catch (error) {
                logger.addLog("RSS-Reader-ERROR-4", source.url + "-" + source.sourceName + "-" + source.category, error);
            }


        })();


    }

}

module.exports = rss;


