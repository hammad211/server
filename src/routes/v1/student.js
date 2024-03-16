var express = require('express');
var router = express.Router();
var validateStudent = require("../../middleWares/validateStudent");   // checking the role
var auth = require("../../middleWares/auth"); // checking login or logout
var {addNewStudent,singleStudentInfo,singleTutorInfo,addTime, getData, getTimeById, updateStudent,getTimes,getAllTimeSlots} = require("../../controllers/studentControllers"); 

router.post("/studentInfo",auth,validateStudent, addNewStudent);
router.put('/studentInfo',auth,validateStudent, updateStudent);
router.get('/studentInfo',auth,validateStudent, singleStudentInfo);


router.get('/personalInfo',auth,validateStudent, singleTutorInfo);

router.post('/getTutorData',auth,validateStudent, getData);
router.post('/timeInfoById',auth,validateStudent,getTimeById);

router.get('/timeInfoStudent',auth,validateStudent, getTimes);
router.post('/postTime',auth,validateStudent,addTime)
router.get('/getAllTimeSlots',auth,getAllTimeSlots)
module.exports = router;