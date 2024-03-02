const express = require('express');
const router = express.Router();
const auth = require("../../middleWares/auth");   // login or logout
const validate = require("../../middleWares/validate"); // checking the role of teacher
const studentValidate = require("../../middleWares/validateStudent"); // checking the role of student

const { getProposal, addProposal, getProposalStudent } = require('../../controllers/proposalControllers');

router.get('/teacherInfo',auth,validate,getProposal);
router.post('/Info',auth,studentValidate,addProposal);
router.get('/Info',auth,studentValidate,getProposalStudent);

module.exports = router;
