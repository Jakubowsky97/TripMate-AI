import { Router } from "express";
import { checkEmailVerification, confirmEmail, login, loginWithGoogle, logout, refreshToken, saveUserPreferences, verifyToken } from "../controllers/authController";
import { getUserProfile, updateUserProfile } from "../controllers/profileController";

const router = Router();

// GET endpoint do potwierdzenia e-maila (np. poprzez link)
router.get("/confirm", confirmEmail);
router.get("/checkEmail", checkEmailVerification);
router.post("/savePreferences", saveUserPreferences);
router.get("/getUser", getUserProfile);
router.post("/updateUser", updateUserProfile);
router.post("/login", login);
router.post("/loginGoogle", loginWithGoogle)
router.post("/refresh", refreshToken)
router.post("/logout", logout)
router.get("/verify", verifyToken)

export default router;
