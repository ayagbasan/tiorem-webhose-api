const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialSchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId, 
    likes:Number,
    comments:Number,
    shares:Number, 
  }
);

module.exports = mongoose.model('Social', SocialSchema);
