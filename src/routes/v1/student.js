var express = require('express');
var router = express.Router();
var validateStudent = require("../../middleWares/validateStudent");   // checking the role
var auth = require("../../middleWares/auth"); // checking login or logout
var {addNewStudent,singleStudentInfo,singleTutorInfo,getQualifyInfo,getTime,addTime,getCourseRequest, getData, getTimeById, updateStudent,getTimes,getAllTimeSlots} = require("../../controllers/studentControllers"); 

router.post("/studentInfo",auth,validateStudent, addNewStudent);
router.put("/studentInfo",auth,validateStudent, updateStudent);
router.get('/studentInfo',auth,validateStudent, singleStudentInfo);
router.put('/studentInfo',auth,validateStudent, updateStudent);
router.get('/personalInfo',auth,validateStudent, singleTutorInfo);
router.get('/qualificationInfo',auth,validateStudent, getQualifyInfo);
router.post('/getTutorData',auth,validateStudent, getData);
router.get('/timeInfo/:id',auth,validateStudent,getTime);
router.post('/timeInfoById',auth,validateStudent,getTimeById);
router.get('/reqInfo',auth,validateStudent, getCourseRequest);
router.get('/timeInfoStudent',auth,validateStudent, getTimes);
router.post('/postTime',auth,validateStudent,addTime)
router.get('/getAllTimeSlots',auth,getAllTimeSlots)
module.exports = router;