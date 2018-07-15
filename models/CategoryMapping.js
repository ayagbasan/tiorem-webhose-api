const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const CategoryMappingSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    googleCategoryName: { type: String },
    tioremCategoryName: { type: String }
  }
);

CategoryMappingSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("CategoryMapping", CategoryMappingSchema);
