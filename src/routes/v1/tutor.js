const express = require('express');
const router = express.Router();
const auth = require("../../middleWares/auth");
const validate = require("../../middleWares/validate"); 
const {getComment, singleTutorInfo,addNewTutor,addTime_slot,getSelectedSlots, addNewQualify, getQualifyInfo,updateTutor,updateQualify,deleteQualifyInfo} = require ("../../controllers/tutorControllers")


router.get('/comment',auth,validate,singleTutorInfo);
router.get('/personalInfo',auth,validate,getComment);

router.post('/personalInfo',auth,validate,addNewTutor);
router.put('/personalInfo',auth,validate,updateTutor);

router.post('/qualificationInfo',auth,validate,addNewQualify);
router.put('/qualificationInfo',auth,validate,updateQualify);
router.get('/qualificationInfo',auth,validate,getQualifyInfo);
router.delete('/qualificationInfo/id', auth, validate, deleteQualifyInfo);


router.post('/timeInfoSlot',auth,addTime_slot);
router.get('/timeInfoSlot',auth,getSelectedSlots);

module.exports = router;
