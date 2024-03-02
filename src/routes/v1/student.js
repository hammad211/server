var express = require('express');
var router = express.Router();
var validateStudent = require("../../middleWares/validateStudent");   // checking the role
var auth = require("../../middleWares/auth"); // checking login or logout
var {addNewStudent,singleStudentInfo,singleTutorInfo,getQualifyInfo,getTime,getCourseRequest, getData, getTimeById, updateStudent} = require("../../controllers/studentControllers"); 

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

module.exports = router;