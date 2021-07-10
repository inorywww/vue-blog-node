const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const SaySchema = new Schema({
    sayID:{
        type:Number,
        required:true
    },
    userAvatar:{
        type:String,
    },
    userName:{
        type:String,
        default:"inoryww"
    },
    releaseTime:{
        type:Number,
        default:Date.now()
    },
    userIdentity:{
        type:String,
        default:"博主、管理员"
    },
    content:{
        type:String,
        required:true
    },
    coverSrc:{
        type:String,
    },
});

module.exports = Say = mongoose.model("says", SaySchema);