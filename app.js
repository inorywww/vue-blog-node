const express = require("express");
const app = express();

// const utils = require('./utils'); //此次启动使用

// passport 初始化 
const passport = require("passport");
app.use(passport.initialize());
require("./config/passport")(passport);

// express.json()解析数据
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// import api
const users = require("./routes/api/users");
const articles = require("./routes/api/articles");
const says = require("./routes/api/says");
const messages = require("./routes/api/messages");
const tags = require("./routes/api/tags");
const courses = require("./routes/api/courses");
const upload = require("./routes/api/upload");
const home = require("./routes/api/home");

//use routes    
app.use("/api/admin", users);
app.use("/api/article", articles);
app.use("/api/say", says);
app.use("/api/message", messages);
app.use("/api/tag", tags);
app.use("/api/upload", upload);
app.use("/api/home",home);
app.use("/api/course",courses);

// utils.getTags(); // 此次启动使用 获取文章中和数据库中所有tag
module.exports = app;