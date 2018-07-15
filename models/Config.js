const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubConfig = require('./SubConfig');

const ConfigSchema = new Schema
  ({
    _id: mongoose.Schema.Types.ObjectId,
    GoogleRSS: SubConfig.schema,
    WebHose: SubConfig.schema,
    Mapping: SubConfig.schema,
    Translate: SubConfig.schema,
    RssSources: SubConfig.schema,
    Category: SubConfig.schema,
    Version:
    {
      type: Number,
      unique: true,
      default: 1
    },
    CreatedAt:
    {
      type: Date,
      default: new Date()
    }



  });

module.exports = mongoose.model('Config', ConfigSchema);
