var express = require('express');
var router = express.Router();

const {Signup,login, getRecords,findUser,resetPassword,refreshToken} = require("../../controllers/userControllers.js");
  router.post("/signup",Signup);
  router.post("/login",login);
  router.post("/findUser",findUser);
  router.post("/resetPassword",resetPassword);
  router.post("/refreshToken",refreshToken);


  

module.exports = router;
