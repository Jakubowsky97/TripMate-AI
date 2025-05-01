"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/sendMessage', auth_1.authenticate, chatController_1.chatController);
router.get('/history', auth_1.authenticate, chatController_1.getChatHistory);
exports.default = router;
