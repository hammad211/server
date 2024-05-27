const { Router } = require("express");
const router = Router();
const {  singleTutorInfo,addNewTutor, approveTutor,approveResponse  } = require("../../controllers/adminControllers"); 

// router.post("/conversation", postConversation);
router.get("/personalInfo", singleTutorInfo);
router.get("/response/:id", approveResponse);
router.post("/personalInfo", addNewTutor);
router.put("/personalInfo", approveTutor);




module.exports = router;
