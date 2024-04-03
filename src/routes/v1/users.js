var express = require('express');
var router = express.Router();

const {Signup,login, getRecords,findUser,resetPassword,refreshToken, matchOTP} = require("../../controllers/userControllers.js");
  router.post("/signup",Signup);
  router.post("/login",login);
  router.post("/findUser",findUser);
  router.post("/resetPassword",resetPassword);
  router.post("/refreshToken",refreshToken);
  router.post("/otp",matchOTP);



  

module.exports = router;
