const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const EntitySchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId, 
    persons:[String],
    organizations:[String],
    locations:[String]
  }
);

module.exports = mongoose.model('Entity', EntitySchema);
