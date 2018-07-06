const mongoose = require('mongoose');
const Social = require('./Social');
const Schema = mongoose.Schema;

const ThreadSchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId, 
    uuid:String,
    url:String,
    site_full:String,
    site:String,
    site_section:String,
    section_title:String,
    title:String,
    title_full:String,
    published:Date,
    replies_count:Number,
    participants_count:Number,
    site_type:String,
    main_image:String,
    country:String,
    site_category:String,
    social:[Social.schema],
    performance_score:Number,
    spam_score:Number,
    domain_rank:Number
  }
);

module.exports = mongoose.model('Thread', ThreadSchema);
