const express = require('express');
const router = express.Router();
const validate = require("../../middleWares/validate");   // checking the role
const validateStudent = require("../../middleWares/validateStudent");   // checking the role
const auth = require("../../middleWares/auth"); // checking login or logout
const {addCourseRequest,getCourseRequest, updateCourseRequest, deleteRecordById} = require("../../controllers/requestControllers"); 
router.post("/reqInfo",auth,validate, addCourseRequest);
router.get('/reqInfo',auth,validate, getCourseRequest);
router.put('/reqInfo', auth, validate, updateCourseRequest);
router.delete('/reqInfo/:id', auth, validate, deleteRecordById);

module.exports = router;