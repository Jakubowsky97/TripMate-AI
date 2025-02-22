import { Router } from "express";
import { checkEmailVerification, confirmEmail, saveUserPreferences } from "../controllers/authController";
import { getUserProfile, updateUserProfile } from "../controllers/profileController";

const router = Router();

// GET endpoint do potwierdzenia e-maila (np. poprzez link)
router.get("/confirm", confirmEmail);
router.get("/checkEmail", checkEmailVerification);
router.post("/savePreferences", saveUserPreferences);
router.get("/getUser", getUserProfile);
router.post("/updateUser", updateUserProfile);

export default router;
