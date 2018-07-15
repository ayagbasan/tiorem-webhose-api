const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const RssCategorySchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    rssNewsId: { type: Schema.Types.ObjectId, ref: 'Rss' },
    categoryName: { type: String },
    score: { type: Number },
    createdAt:
    {
      type: Date,
      default: Date.now
    },     
    active:
    {
      type: Boolean,
      default: true
    }
  }
);

RssCategorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("RssCategory", RssCategorySchema);
