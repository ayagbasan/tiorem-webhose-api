const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


const GoogleRssSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        relatedId:  {
            type: String,
            default:""
        },
        title: {
            unique: true,
            type: String,
        },
        link: {
            type: String,
        },
        clusterId: {
            type: String,
        },
        guid: {
            unique: true,
            type: String,
        },
        category: {
            type: String,
        },

        pubDate: {
            type: Date,
        },
        isoDate: {
            type: Date,
        },
        content: {
            type: String,
        },
        contentSnippet: {
            type: String,
        },
        createdAt:
        {
            type: Date,
            default: Date.now
        },
        source: {
            type: String,
        },
         
        newsId:  {
            type: String
        },

    }
);

GoogleRssSchema.plugin(mongoosePaginate);
 
module.exports = mongoose.model('GoogleRss', GoogleRssSchema);