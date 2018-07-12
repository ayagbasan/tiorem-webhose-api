const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const RssSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        relatedId: {
            type: String,
            default: ""
        },
        source: {
            type: String,
        },
        title: {
            type: String,
        },
        link: {
            unique:true,
            type: String,
        },
        description: {
            type: String,
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
        isTranslated:
        {
            type: Boolean,
            default: false
        },
        isMapped:
        {
            type: Boolean,
            default: false
        }

    }
);

RssSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Rss', RssSchema);