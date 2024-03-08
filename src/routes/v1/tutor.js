const express = require('express');
const router = express.Router();
const auth = require("../../middleWares/auth");   // login or logout
const validate = require("../../middleWares/validate"); // checking the role of teacher
const {singleTutorInfo,addNewTutor,addTime_slot,getSelectedSlots, addNewQualify, getQualifyInfo,addTime,getTime,getTimeScdule,deleteTime,updateTutor,updateQualify,addSubject,getSubject, updateSubject} = require ("../../controllers/tutorControllers")

router.get('/personalInfo',auth,validate,singleTutorInfo);
router.post('/personalInfo',auth,validate,addNewTutor);
router.put('/personalInfo',auth,validate,updateTutor);
router.post('/qualificationInfo',auth,validate,addNewQualify);
router.put('/qualificationInfo',auth,validate,updateQualify);

router.put('/subject',auth,validate,updateSubject);
router.post('/subject',auth,validate,addSubject);
router.get('/subject',auth,validate,getSubject);

router.get('/qualificationInfo',auth,validate,getQualifyInfo);
router.post('/timeInfoSchdule',auth,validate,addTime);
router.get('/timeInfoSchdule',auth,validate,getTimeScdule);
router.get('/timeInfo',auth,validate,getTime);
router.post('/timeInfoSlot',auth,addTime_slot);
router.get('/timeInfoSlot',auth,getSelectedSlots);

router.delete('/deleteTime/:id',auth,validate,deleteTime);
module.exports = router;
