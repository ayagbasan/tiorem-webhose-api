const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubConfigSchema = new Schema
  ({
    _id: mongoose.Schema.Types.ObjectId,
    searchQuery: String,
    apiSecretKey: String,
    periode: { type: String, required: true,default :"00 * * * * *" },
    lastTimestamp: Number,
    status: { type: Number, required: true, default:1},
    nextRunTime: Date,
    lastRunTime: Date,
    maxQueryLimit:Number,
    jobName: { type: String, required: true, unique: true, minlength: 4 },
    jobTag:{ type: String, required: true, unique: true, minlength: 4 },
    autoStart:{ type: Boolean, required: true, default:true },
    runOnInit:{ type: Boolean, required: true, default:true }

  });

module.exports = mongoose.model('SubConfig', SubConfigSchema);
