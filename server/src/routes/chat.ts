import { Router } from "express";
import { chatController, getChatHistory } from "../controllers/chatController";

const router = Router();

router.post('/sendMessage', chatController)
router.get('/history', getChatHistory)

export default router;