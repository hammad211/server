const { Router } = require("express");
const router = Router();
const {  getReview  } = require("../../controllers/homeControllers"); 

router.get("/getreview", getReview);



module.exports = router;
