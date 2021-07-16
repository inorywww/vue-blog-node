const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const ArticleSchema = new Schema({
    articleID:{
        type:Number,
        required:true,
        default:0
    },
    fileName:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    coverSrc:{
        type:String,
    },
    title:{
        type:String,
        required:true
    },
    releaseTime:{
        type:Number,
        default:Date.now()
    },
    introduction:{
        type:String
    },
    tags:{
        type:Array
    },
});

module.exports = Article = mongoose.model("articles", ArticleSchema);