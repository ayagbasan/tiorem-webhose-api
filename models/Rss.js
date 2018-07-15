const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const RssSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
       
        source: {
            type: String,
        },
        title: {
            type: String,
        },
        link: {
            unique: true,
            type: String,
        },
        description: {
            type: String,
        },
        descriptionEn: {
            type: String,
            default: ""
        },
        guid: {
            type: String,
        },
        enclosureUrl: {
            type: String,
        },
        mediaUrl: {
            type: String,
        },
        pubDate: {
            type: Date,
        },
        category: {
            type: String,
        },
        createdAt:
        {
            type: Date,
            default: Date.now
        },
        updatedAt:
        {
            type: Date
        },
        isTranslate:
        {
            type: Boolean,
            default: false
        },
        isMapped:
        {
            type: Boolean,
            default: false
        },
        newsId: {
            type: String,
            default: ""
        },
        relatedId: {
            type: String,
            default: ""
        },

    }
);

RssSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Rss', RssSchema);