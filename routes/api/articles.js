// @login && register && auth
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Article = require("../../models/Article");

// addArticle api
// $route POST api/admin/article/add
// @desc 添加article
// @access Private
router.post("/add",passport.authenticate("jwt", {session: false}), (req, res) => {
    const articleFields = {};
    if(req.body.articleID) articleFields.articleID = req.body.articleID;
    if(req.body.fileName) articleFields.fileName = req.body.fileName;
    if(req.body.coverSrc) articleFields.coverSrc = req.body.coverSrc;
    if(req.body.title) articleFields.title = req.body.title;
    if(req.body.introduction) articleFields.introduction = req.body.introduction;
    if(req.body.action) articleFields.action = req.body.action;
    if(req.body.tags) articleFields.tags = req.body.tags;

    new Article(articleFields).save()
        .then(article => {
            res.json(article)
        })
})

// getArticles api
// $route GET api/admin/article
// @desc 获取所有article
// @access Public
router.get("/", (req, res) => {
    Article.find().then(article => {
        if(!article){
            return res.status(404).json("没有任何内容");
        }
        res.json(article)
    }).catch(err => res.status(404).json(err))
})

// getOneArticle api
// $route GET api/admin/article/:articleID
// @desc 获取一个article
// @access Public
router.get("/:articleID", (req, res) => {
    Article.findOne({articleID:req.params.articleID})
        .then(article => {
            if(!article){
                return res.status(404).json("没有任何内容");
            }
            res.json(article);
    }).catch(err => res.status(404).json(err))
})

// editOneArticle api
// $route GET api/admin/article/edit/:articleID
// @desc 编辑article
// @access Private
router.post("/edit/:articleID",passport.authenticate("jwt", {session: false}), (req, res) => {
    const articleFields = {};
    if(req.body.articleID) articleFields.articleID = req.body.articleID;
    if(req.body.fileName) articleFields.fileName = req.body.fileName;
    if(req.body.coverSrc) articleFields.coverSrc = req.body.coverSrc;
    if(req.body.title) articleFields.title = req.body.title;
    if(req.body.introduction) articleFields.introduction = req.body.introduction;
    if(req.body.action) articleFields.action = req.body.action;
    if(req.body.tags) articleFields.tags = req.body.tags;

    Article.findOneAndUpdate(
        {articleID:req.params.articleID},
        {$set:articleFields},
        {new:true})
        .then(article => res.json(article))
})

// deleteOneArticle api
// $route GET api/admin/article/delete/:articleID
// @desc 删除article
// @access Private
router.delete("/delete/:articleID",passport.authenticate("jwt", {session: false}), (req, res) => {
    Article.findOneAndRemove({articleID:req.params.articleID})
        .then(article => {
            res.json(article);
        }).catch(err => res.status(404).json("删除失败"))
})

module.exports = router;