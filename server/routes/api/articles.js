// @login && register && auth
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Article = require("../../models/Article");
const utils = require('../../utils'); //此次启动使用

const multer = require("multer");
const fs = require("fs");

// addArticle api
// $route POST api/article/add
// @desc 添加article
// @access Private
router.post("/add", passport.authenticate("jwt", {
    session: false
}), async (req, res) => {
    const articleFields = {};
    // 自动生成新的id
    await Article.find().then(article => {
        newID = Math.max.apply(Math, article.map(function (o) {
            return o.articleID
        })) + 1;
    }).catch(err => console.log(err));
    articleFields.articleID = newID;

    if (req.body.fileName) articleFields.fileName = req.body.fileName;
    if (req.body.coverSrc) articleFields.coverSrc = req.body.coverSrc;
    if (req.body.title) articleFields.title = req.body.title;
    if (req.body.introduction) articleFields.introduction = req.body.introduction;
    if (req.body.tags) articleFields.tags = req.body.tags;

    await new Article(articleFields).save()
        .then(article => {
            res.json(article);
        })
    utils.getTags();
})

// getArticles api
// $route GET api/article
// @desc 获取所有article
// @access Public
router.get("/", (req, res) => {
    Article.find().then(article => {
        if (!article) {
            return res.status(404).json("没有任何内容");
        }
        res.json(article)
    }).catch(err => res.status(404).json(err))
})

// getOneArticle api
// $route GET api/article/:articleID
// @desc 获取一个article
// @access Public
router.get("/:articleID", (req, res) => {
    Article.findOne({
            articleID: req.params.articleID
        })
        .then(article => {
            if (!article) {
                return res.status(404).json("没有任何内容");
            }
            res.json(article);
        }).catch(err => res.status(404).json(err))
})

// editOneArticle api
// $route GET api/article/edit/:articleID
// @desc 编辑article
// @access Private
router.post("/edit/:articleID", passport.authenticate("jwt", {
    session: false
}), async (req, res) => {
    const articleFields = {};
    if (req.body.articleID) articleFields.articleID = req.body.articleID;
    if (req.body.fileName) articleFields.fileName = req.body.fileName;
    if (req.body.coverSrc) articleFields.coverSrc = req.body.coverSrc;
    if (req.body.title) articleFields.title = req.body.title;
    if (req.body.introduction) articleFields.introduction = req.body.introduction;
    if (req.body.tags) articleFields.tags = req.body.tags;

    await Article.findOneAndUpdate({
            articleID: req.params.articleID
        }, {
            $set: articleFields
        }, {
            new: true
        })
        .then(article => res.json(article));
    utils.getTags();
})

// deleteOneArticle api
// $route GET api/article/delete/:articleID
// @desc 删除article
// @access Private
router.delete("/delete/:articleID", passport.authenticate("jwt", {session: false}), async (req, res) => {
    await Article.findOneAndRemove({
            articleID: req.params.articleID
        })
        .then(article => {
            console.log('delete success')
            res.json(article);
        }).catch(err => res.status(400).json("删除失败"));
    utils.getTags();
})


let upload = multer({
    storage: multer.diskStorage({
      //设置文件存储位置
      destination: function (req, file, cb) {
        let dir = '';
        if(file.originalname.split('.')[1] === 'md'){
           dir = "public/articles/mdFile";
        }
        else{
            dir = "public/articles/cover";
        }
        //判断目录是否存在，没有则创建
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {
            recursive: true
          });
        }
        //dir就是上传服务器成功的图片的存放的目录
        cb(null, dir);
      },
      //设置文件名称并上传文件
      filename: function (req, file, cb) {
        //fileName就是上传文件的文件名
        cb(null, file.originalname);
      }
    })
});

router.post('/upload', upload.single('file'), async (req, res) => {
   
    res.json({
      file: req.file
    })
  });

module.exports = router;