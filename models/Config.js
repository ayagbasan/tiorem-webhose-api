const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConfigSchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId, 
    last_timestamp:Number,
    search_query:String,
    job_next_run:Date, 
    api_secret_key:String, 
    job_periode:String, 
  }
);

module.exports = mongoose.model('Config', ConfigSchema);
 