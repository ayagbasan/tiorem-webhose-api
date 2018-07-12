const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubConfigSchema = new Schema
  ({
    _id: mongoose.Schema.Types.ObjectId,
    searchQuery: String,
    apiSecretKey: String,
    periode: String,
    lastTimestamp: Number,
    status: Number,
    nextRunTime: Date,
    lastRunTime: Date,
    maxQueryLimit:Number
  });

module.exports = mongoose.model('SubConfig', SubConfigSchema);
