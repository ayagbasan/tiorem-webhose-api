let Parser = require('rss-parser');
const mongoose = require('mongoose');
const striptags = require('striptags');
let parser = new Parser();
const Rss = require('../models/Rss');
const logger = require('../helper/logger');

var rss = {

    read: (source) => {

        console.log("reading start from", source.sourceName, source.category);

        return (async () => {

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

                }
            }



            Rss.insertMany(feed.items, { ordered: false })
                .then(function (mongooseDocuments) {

                    console.log("FULL INSERT - reading completed from ", source.sourceName, source.category, feed.items.length);
                    logger.addLog("RSS-Reader", source.sourceName + "-" + source.category, type, feed.items.length, 0, 0);

                })
                .catch(function (err) {
                    if (err.writeErrors) {
                        let type = "PARTIAL INSERT";
                        if (err.writeErrors.length === feed.items.length)
                            type = "FULL DUPLICATE";

                        console.log(type, "reading completed from", source.sourceName, source.category,
                            "Total items:", feed.items.length,
                            "New items:", feed.items.length - err.writeErrors.length,
                            "Duplicate items", err.writeErrors.length);
                        logger.addLog("RSS-Reader", source.sourceName + "-" + source.category, type, feed.items.length, feed.items.length - err.writeErrors.length, err.writeErrors.length);
                    } else {
                        console.log("reading completed from", source.url, "unknown error", err);
                        logger.addLog("RSS-Reader-ERROR", source.sourceName + "-" + source.category, err, 0, 0, 0);
                    }

                });

        })();


    }

}

module.exports = rss;


