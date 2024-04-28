const { Router } = require("express");
const router = Router();
const {  singleTutorInfo,addNewTutor  } = require("../../controllers/adminControllers"); 

// router.post("/conversation", postConversation);
router.get("/personalInfo", singleTutorInfo);
router.post("/personalInfo", addNewTutor);



module.exports = router;
