const express = require('express');
const router = express.Router();
const validate = require("../../middleWares/validate");   // checking the role
const validateStudent = require("../../middleWares/validateStudent");   // checking the role
const auth = require("../../middleWares/auth"); // checking login or logout
const {getCourseRequest, updateCourseRequest, deleteRecordById, endRequest} = require("../../controllers/requestControllers"); 

router.get('/reqInfo',auth,validate, getCourseRequest);
router.put('/reqInfo', auth, validate, updateCourseRequest);
router.delete('/reqInfo',auth, validate, deleteRecordById);
router.post('/reqInfoComplete',auth, validate, endRequest);
module.exports = router;