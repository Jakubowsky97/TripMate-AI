import { Router } from "express";
import { chatController, getChatHistory } from "../controllers/chatController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/sendMessage', authenticate, chatController)
router.get('/history', authenticate, getChatHistory)

export default router;