var express = require('express');
var router = express.Router();
var validate = require("../../middleWares/validate");   // checking the role
var validateStudent = require("../../middleWares/validateStudent");   // checking the role
var auth = require("../../middleWares/auth"); // checking login or logout
var { getSearchResult} = require("../../controllers/searchControllers"); 
router.post("/searchInfo",auth, getSearchResult);
module.exports = router;