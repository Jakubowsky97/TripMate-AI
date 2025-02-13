import { Router } from "express";
import { checkEmailVerification, confirmEmail } from "../controllers/authController";

const router = Router();

// GET endpoint do potwierdzenia e-maila (np. poprzez link)
router.get("/confirm", confirmEmail);
router.get("/checkEmail", checkEmailVerification);

export default router;
