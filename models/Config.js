const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubConfig = require('./SubConfig');

const ConfigSchema = new Schema
  ({
    _id: mongoose.Schema.Types.ObjectId,
    search_query: String,
    api_secret_key: String,
    job_next_run: Date,

    job_periode_WebHose: String,
    last_timestamp_WebHose: Number,
    status_WebHose: Number,
    job_next_run_WebHose: Date,

    job_periode_GoogleRss: String,
    last_timestamp_GoogleRss: Number,
    status_GoogleRSS: Number,
    job_next_run_GoogleRss: Date,

    GoogleRSS : SubConfig.schema,
    WebHose : SubConfig.schema,
    Version :
    {
      type:Number,
      unique:true,
      default:1
    },
    CreatedAt :
    {
      type:Date, 
      default: new Date()
    }



  });

module.exports = mongoose.model('Config', ConfigSchema);
