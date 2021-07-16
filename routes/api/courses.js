const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const Course = require("../../models/Course");

// const utils = require('../utils')
// addCourse api
// $route POST api/admin/course/add
// @desc 添加Course
// @access Private
router.post("/add",passport.authenticate("jwt", {session: false}), async (req, res) => {
    const courseFields = {};
     // 自动生成新的id
    let newID = 0;
    await Course.find().then(course => {
        newID = Math.max.apply(Math, course.map(function(o) {return o.courseID})) + 1;
    });
    courseFields.courseID = newID;
    if(req.body.title) courseFields.title = req.body.title;
    if(req.body.content) courseFields.content = req.body.content;

    new Course(courseFields).save().then(course => res.json(course));
})

// getCourses api
// $route GET api/admin/course
// @desc 获取所有Course
// @access Public
router.get("/", (req, res) => {
    Course.find().then(course => {
        if(!course){
            return res.status(404).json("没有任何内容");
        }
        res.json(course)
    }).catch(err => res.status(404).json(err))
})

// getOneCourse api
// $route GET api/admin/course/:courseID
// @desc 获取一个Course
// @access Public
router.get("/:courseID", (req, res) => {
    Course.findOne({courseID:req.params.courseID})
        .then(course => {
            if(!course){
                return res.status(404).json("没有任何内容");
            }
            res.json(course)
    }).catch(err => res.status(404).json(err))
})

// editOneCourse api
// $route GET api/admin/course/edit/:courseID
// @desc 编辑Course
// @access Private
router.post("/edit/:courseID",passport.authenticate("jwt", {session: false}), (req, res) => {
    const courseFields = {};
    if(req.body.courseID) courseFields.courseID = req.body.courseID;
    if(req.body.time) courseFields.time = req.body.time;
    if(req.body.title) courseFields.title = req.body.title;
    if(req.body.content) courseFields.content = req.body.content;
    Course.findOneAndUpdate(
        {courseID:req.params.courseID},
        {$set:courseFields},
        {new:true})
        .catch(err => res.status(404).json("更新失败"));
})

// deleteOneCourse api
// $route GET api/admin/course/delete/:courseID
// @desc 删除Course
// @access Private
router.delete("/delete/:courseID",passport.authenticate("jwt", {session: false}), (req, res) => {
    Course.findOneAndRemove({courseID:req.params.courseID})
        .then(course => {
            res.json(course);
        }).catch(err => res.status(404).json("删除失败"));
})

module.exports = router;