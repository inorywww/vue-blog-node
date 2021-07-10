const express = require("express");
const app = express();

// passport 初始化
const passport = require("passport");
app.use(passport.initialize());
require("./config/passport")(passport);

// express.json()解析数据
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// import api
const users = require("./routes/api/users");

//use routes
app.use("/api/users",users);

module.exports = app;