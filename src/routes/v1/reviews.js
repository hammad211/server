const express = require('express');
const router = express.Router();
const auth = require("../../middleWares/auth");   // login or logout
const validate = require("../../middleWares/validate"); // checking the role of teacher
const {getReviews,addNewReview,getReviewsStudent} = require ("../../controllers/reviewsControllers")

router.get('/reviewInfo',auth,getReviews);
router.post('/reviewInfo',auth,addNewReview);
router.get('/reviewStudent',auth,getReviewsStudent);


module.exports = router;
