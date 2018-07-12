let Parser = require('rss-parser');
const mongoose = require('mongoose');
let parser = new Parser();
const Rss = require('../models/Rss');


var rss = {

    read: (source) => {

        console.log("reading start from", source.sourceName, source.category);

        return (async () => {

            let feed = await parser.parseURL(source.url);
            //console.log(feed);
            for (let i = 0; i < feed.items.length; i++) {
                feed.items[i]._id = new mongoose.Types.ObjectId();
                feed.items[i].category = source.category;
                feed.items[i].source = source.sourceName;
                feed.items[i].pubDate = new Date(feed.items[i].pubDate);
            }



            Rss.insertMany(feed.items, { ordered: false })
                .then(function (mongooseDocuments) {

                    console.log("FULL INSERT - reading completed from ", source.sourceName, source.category, feed.items.length);
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
                    } else {
                        console.log("reading completed from", source.url, "unknown error", err);
                    }

                });

        })();


    }

}

module.exports = rss;


