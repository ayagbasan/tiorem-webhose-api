const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const Schema = mongoose.Schema;
const Thread = require('./Thread');
const Entity = require('./Entity');
const WebHoseSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    uuid: String,
    thread: Thread.schema,
    url: String,
    ord_in_thread: Number,
    author: String,
    published: Date,
    title: String,
    text: String,
    language: String,
    external_links: [String],
    rating: Number,
    entities: [Entity.schema],
    crawled: Date,
    isProcess: {
      type: Boolean,
      default: false
    },
    googleId: String,
    createdAt:
    {
      type: Date,
      default: Date.now
    },
    textEn: {
      type: String,
      default: ""
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

WebHoseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('WebHose', WebHoseSchema);
