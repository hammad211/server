var express = require('express');
var router = express.Router();
var auth = require("../../middleWares/auth"); // checking login or logout
var {addImage, updateImage, getImage, getImageById } = require("../../controllers/imageControllers"); 
router.post("/imgInfo",auth, addImage);
router.get('/imgInfo',auth, getImage);
router.put('/imgInfo', auth, updateImage);
router.get('/imgInfo/:id', auth, getImageById);

module.exports = router;