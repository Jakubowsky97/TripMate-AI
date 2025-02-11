import { Router } from "express";
import { confirmEmail } from "../controllers/authController";

const router = Router();

// GET endpoint do potwierdzenia e-maila (np. poprzez link)
router.get("/confirm", confirmEmail);

export default router;
