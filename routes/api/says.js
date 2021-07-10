// @login && register && auth
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Say = require("../../models/Say");

// addSay api
// $route POST api/admin/say/add
// @desc 添加say
// @access Private
router.post("/add",passport.authenticate("jwt", {session: false}), (req, res) => {
    const sayFields = {};
    if(req.body.sayID) sayFields.sayID = req.body.sayID;
    if(req.body.userAvatar) sayFields.userAvatar = req.body.userAvatar;
    if(req.body.userName) sayFields.userName = req.body.userName;
    if(req.body.content) sayFields.content = req.body.content;
    if(req.body.coverSrc) sayFields.coverSrc = req.body.coverSrc;

    new Say(sayFields).save()
        .then(say => {
            res.json(say)
        })
})

// getSays api
// $route GET api/admin/say
// @desc 获取所有say
// @access Public
router.get("/", (req, res) => {
    Say.find().then(say => {
        if(!say){
            return res.status(404).json("没有任何内容");
        }
        res.json(say)
    }).catch(err => res.status(404).json(err))
})

// getOneSay api
// $route GET api/admin/say/:sayID
// @desc 获取一个say
// @access Public
router.get("/:sayID", (req, res) => {
    Say.findOne({sayID:req.params.sayID})
        .then(say => {
            if(!say){
                return res.status(404).json("没有任何内容");
            }
            res.json(say)
    }).catch(err => res.status(404).json(err))
})

// editOneSay api
// $route GET api/admin/say/edit/:sayID
// @desc 编辑say
// @access Private
router.post("/edit/:sayID",passport.authenticate("jwt", {session: false}), (req, res) => {
    const sayFields = {};
    if(req.body.sayID) sayFields.sayID = req.body.sayID;
    if(req.body.userAvatar) sayFields.userAvatar = req.body.userAvatar;
    if(req.body.userName) sayFields.userName = req.body.userName;
    if(req.body.content) sayFields.content = req.body.content;
    if(req.body.coverSrc) sayFields.coverSrc = req.body.coverSrc;

    Say.findOneAndUpdate(
        {sayID:req.params.sayID},
        {$set:sayFields},
        {new:true})
        .then(say => res.json(say))
})

// deleteOneSay api
// $route GET api/admin/say/delete/:sayID
// @desc 删除say
// @access Private
router.delete("/delete/:sayID",passport.authenticate("jwt", {session: false}), (req, res) => {
    Say.findOneAndRemove({sayID:req.params.sayID})
        .then(say => {
            res.json(say);
        }).catch(err => res.status(404).json("删除失败"))
})

module.exports = router;