const { Router } = require("express");
const router = Router();
const {  singleTutorInfo,addNewTutor, approveTutor  } = require("../../controllers/adminControllers"); 

// router.post("/conversation", postConversation);
router.get("/personalInfo", singleTutorInfo);
router.post("/personalInfo", addNewTutor);
router.put("/approve", approveTutor);




module.exports = router;
