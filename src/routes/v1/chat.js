const { Router } = require("express");
const router = Router();
const {  getConversationId, postMessage, getMessage } = require("../../controllers/chatControllers"); 

// router.post("/conversation", postConversation);
router.get("/conversation/:userId", getConversationId);
router.post("/message", postMessage);
router.get("/message/:conversation_id", getMessage);

module.exports = router;
