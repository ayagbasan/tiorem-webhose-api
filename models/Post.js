const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Thread = require('./Thread');
const Entity = require('./Entity');
const PostSchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId, 
    uuid:String,
    thread :Thread.schema,
    url:String,
    ord_in_thread:Number,
    author:String,
    published:Date,
    title:String,
    text:String,
    language:String,
    external_links:[String],
    rating:Number,
    entities:[Entity.schema],
    crawled:Date,
    isProcess:{
      type:Boolean,
      default:false
    },
    googleId: String,
    relatedNewsId : String

  }
);

module.exports = mongoose.model('Post', PostSchema);
