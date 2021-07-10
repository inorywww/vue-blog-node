// @login && register && auth
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Tag = require("../../models/Tag");

// addTag api
// $route POST api/admin/tag/add
// @desc 添加tag
// @access Private
router.post("/add",passport.authenticate("jwt", {session: false}), (req, res) => {
    const tagFields = {};
    if(req.body.tagID) tagFields.tagID = req.body.tagID;
    if(req.body.tagName) tagFields.tagName = req.body.tagName;
    if(req.body.totalNum) tagFields.totalNum = req.body.totalNum;

    new Tag(tagFields).save()
        .then(tag => {
            res.json(tag)
        })
})

// getTags api
// $route GET api/admin/tag
// @desc 获取所有tag
// @access Public
router.get("/", (req, res) => {
    Tag.find().then(tag => {
        if(!tag){
            return res.status(404).json("没有任何内容");
        }
        res.json(tag)
    }).catch(err => res.status(404).json(err))
})

// getOneTag api
// $route GET api/admin/tag/:tagID
// @desc 获取一个tag
// @access Public
router.get("/:tagID", (req, res) => {
    Tag.findOne({tagID:req.params.tagID})
        .then(tag => {
            if(!tag){
                return res.status(404).json("没有任何内容");
            }
            res.json(tag)
    }).catch(err => res.status(404).json(err))
})

// editOneTag api
// $route GET api/admin/tag/edit/:tagID
// @desc 编辑tag
// @access Private
router.post("/edit/:tagID",passport.authenticate("jwt", {session: false}), (req, res) => {
    const tagFields = {};
    if(req.body.tagID) tagFields.tagID = req.body.tagID;
    if(req.body.tagName) tagFields.tagName = req.body.tagName;
    if(req.body.totalNum) tagFields.totalNum = req.body.totalNum;

    Tag.findOneAndUpdate(
        {tagID:req.params.tagID},
        {$set:tagFields},
        {new:true})
        .then(tag => res.json(tag))
})

// deleteOneTag api
// $route GET api/admin/tag/delete/:tagID
// @desc 删除tag
// @access Private
router.delete("/delete/:tagID",passport.authenticate("jwt", {session: false}), (req, res) => {
    Tag.findOneAndRemove({tagID:req.params.tagID})
        .then(tag => {
            res.json(tag);
        }).catch(err => res.status(404).json("删除失败"))
})

module.exports = router;