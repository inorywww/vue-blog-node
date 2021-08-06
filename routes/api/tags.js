// @login && register && auth
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Tag = require("../../models/Tag");
const Article = require("../../models/Article");
const utils = require('../../utils')
// addTag api
// $route POST api/admin/tag/add
// @desc 添加tag
// @access Private
router.post("/add",passport.authenticate("jwt", {session: false}), async (req, res) => {
    const tagFields = {};
     // 自动生成新的id
    let newID = 0;
    await Tag.find().then(tag => {
        newID = Math.max.apply(Math, tag.map(function(o) {return o.tagID})) + 1;
    });
    tagFields.tagID = newID;
    tagFields.totalNum = 0;
    if(req.body.tagName) tagFields.tagName = req.body.tagName;

    new Tag(tagFields).save().then(tag => res.json(tag));
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
        res.json(tag.sort(utils.compare("totalNum")))
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
        .then(tag => {
            editOrDel('edit',req.body.oldTagName,tagFields.tagName)
            res.json(tag);
        })
})

// deleteOneTag api
// $route GET api/admin/tag/delete/:tagID
// @desc 删除tag
// @access Private
router.delete("/delete/:tagID",passport.authenticate("jwt", {session: false}), (req, res) => {
    Tag.findOneAndRemove({tagID:req.params.tagID})
        .then(tag => {
            editOrDel('del', tag.tagName);
            res.json(tag);
        }).catch(err => res.status(404).json("删除失败"));
})

async function editOrDel(action,tagName,newTag = ''){
    let articles = [];
    let newArticles = [];
    console
    await Article.find().then(article => {
        if(article){
            articles = article;
        }
    });
    if(action === 'edit'){
        articles.forEach(item => {
            item.tags.forEach((tag, index) => {
                if(tag === tagName){
                    item.tags[index] = newTag;
                }
            });
            newArticles.push(item);
        });

    }
    else{
        articles.forEach(item => {
            item.tags.forEach((tag, index) => {
                if(tag === tagName){
                    item.tags.splice(index, 1)
                }
            });
            newArticles.push(item);
        })
    }
    newArticles.forEach(item => {
        Article.findOneAndUpdate(
            { articleID: item.articleID},
            { $set: { "tags" : item.tags } },
            {new:true}).catch(err => res.status(400).json("发生错误"))
    })
   
}
module.exports = router;