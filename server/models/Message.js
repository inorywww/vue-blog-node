const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const MessageSchema = new Schema({
    type:{
        type:String,
        required:true
    },
    info:{
        type:Object,
        required:true
    },
    id:{
        type:Number,
        required:true
    },
});

module.exports = Message = mongoose.model("messages", MessageSchema);