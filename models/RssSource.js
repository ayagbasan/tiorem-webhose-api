const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
 
const RssSourceSchema = new Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        sourceName:
        {
            type: String,
        },
        url: {
            type: String,
            unique:true
        },
        category: {type: String},
        lastUpdated:
        {
            type:Date
        },       
        createdAt:
        {
            type: Date,
            default: Date.now
        },
        updatedAt:
        {
            type: Date
        },
        active :
        {
            type:Boolean,
            default:true
        },
        isTranlate :
        {
            type:Boolean,
            default:false
        },

    }
);

RssSourceSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('RssSource', RssSourceSchema);