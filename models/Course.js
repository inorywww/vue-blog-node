const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema
const CourseSchema = new Schema({
    time:{
        type:Number,
        default:Date.now()
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    courseID:{
        type:Number,
        default:0,
    }
});

module.exports = Course = mongoose.model("courses", CourseSchema);