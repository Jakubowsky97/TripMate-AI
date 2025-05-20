import { Router } from "express";
import { checkEmailVerification, confirmEmail, saveUserPreferences } from "../controllers/authController";
import { getUserProfile, updateUserProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/auth";

const router = Router();

// GET endpoint do potwierdzenia e-maila (np. poprzez link)
router.get("/confirm", confirmEmail);
router.get("/checkEmail", checkEmailVerification);
router.post("/savePreferences", authenticate, saveUserPreferences);
router.get("/getUser", authenticate, getUserProfile);
router.post("/updateUser", authenticate, updateUserProfile);


export default router;
