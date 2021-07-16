// @login && register && auth
const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Message = require("../../models/Message");

// addMessage api
// $route POST api/admin/message/add
// @desc 添加message
// @access Public
router.post("/add", async (req, res) => {
    let newID = 0;

    await Message.find().then(message => {
        newID = Math.max.apply(Math, message.map(function(o) {return o.id})) + 1;
    }).catch(err => console.log(err));

    const messageFields = {};
    messageFields.id = newID;
    if(req.body.type) messageFields.type = req.body.type;
    if(req.body.info) messageFields.info = req.body.info;
    new Message(messageFields).save()
        .then(message => {
            res.json(message)
        })
})

// getMessages api
// $route GET api/admin/message
// @desc 获取所有message
// @access Public
router.get("/", (req, res) => {
    Message.find().then(message => {
        if(!message){
            return res.status(404).json("没有任何内容");
        }
        res.json(message)
    }).catch(err => res.status(404).json(err))
})

// getOneMessage api
// $route GET api/admin/message/:type
// @desc 获取一类message
// @access Public
router.get("/:type", (req, res) => {
    Message.find({type:req.params.type})
        .then(message => {
            if(!message){
                return res.status(200).json("没有任何内容");
            }
            res.json(message)
    }).catch(err => res.status(404).json(err))
})

// editOneMessage api
// $route GET api/admin/message/edit/:messageID
// @desc 编辑message
// @access Private
router.post("/edit/:messageID",passport.authenticate("jwt", {session: false}), (req, res) => {
    const messageFields = {};
    
    if(req.body.id) messageFields.id = req.body.id;
    if(req.body.type) messageFields.type = req.body.type;
    if(req.body.info) messageFields.info = req.body.info;

    Message.findOneAndUpdate(
        {id:req.params.messageID},
        {$set:messageFields},
        {new:true})
        .then(message => res.json(message))
})

// deleteOneMessage api
// $route GET api/admin/message/delete/:messageID
// @desc 删除message
// @access Private
router.delete("/delete/:messageID",passport.authenticate("jwt", {session: false}), (req, res) => {
    Message.findOneAndRemove({id:req.params.messageID})
        .then(message => {
            res.json(message);
        }).catch(err => res.status(404).json("删除失败"))
})

module.exports = router;