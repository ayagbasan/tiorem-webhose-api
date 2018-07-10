const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfigSchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId, 
    last_timestamp_WebHose:Number,
    last_timestamp_GoogleRss:Number,
    search_query:String,
    job_next_run:Date, 
    api_secret_key:String, 
    job_periode_WebHose:String, 
    job_periode_GoogleRss:String, 

  }
);

module.exports = mongoose.model('Config', ConfigSchema);
 