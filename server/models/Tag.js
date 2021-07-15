const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const TagSchema = new Schema({
    tagID:{
        type:Number,
        required:true
    },
    tagName:{
        type:String,
        required:true
    },
    totalNum:{
        type:Number,
        default:0
    },
});

module.exports = Tag = mongoose.model("tags", TagSchema);