const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogSchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId, 
    Class:
    {
      type: String,
      required: [true, '`{PATH}` is required.'], 
    },   
    Title:
    {
      type: String,
      required: [true, '`{PATH}` is required.'], 
    },
    Comment:
    {
      type: String,
      required: [true, '`{PATH}` is required.'], 
    },
    TotalResults:
    {
      type: Number
    },
    MoreResultsAvailable:
    {
      type: Number
    },
    RequestsLeft:
    {
      type: Number
    },
    CreatedAt:
    {
      type: Date,
      default: Date.now
    }    
  }
);


module.exports = mongoose.model('Log', LogSchema);
