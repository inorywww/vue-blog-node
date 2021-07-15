// @login && register && auth

const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Say = require("../../models/Say");

const multer = require("multer");
const fs = require("fs");

// addSay api
// $route POST api/admin/say/add
// @desc 添加say
// @access Private
router.post("/add",passport.authenticate("jwt", {session: false}), async (req, res) => {
    const sayFields = {};
    let newID = 0;
    await Say.find().then(say => {
        newID = Math.max.apply(Math, say.map(function(o) {return o.sayID})) + 1;
    });
    sayFields.sayID = newID;
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


let upload = multer({
    storage: multer.diskStorage({
      //设置文件存储位置
      destination: function (req, file, cb) {
        let dir = "public/says/cover";
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