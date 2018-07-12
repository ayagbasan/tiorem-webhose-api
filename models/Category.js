const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const CategorySchema = new Schema(
  {
    _id:mongoose.Schema.Types.ObjectId,
    categoryName:
    {
      type: String,
      required: [true, '`{PATH}` is required.'],
      minlength: [3, '`The minimum length of {PATH}` field must be greater then {MINLENGTH} characters.']
    },
    createdAt:
    {
      type: Date,
      default: Date.now
    },
    updatedAt:
    {
      type: Date, 
    },
    active:
    {
      type: Boolean,
      default: true
    }
  }
);

CategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Category', CategorySchema);
