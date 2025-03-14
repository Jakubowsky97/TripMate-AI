import { Router } from "express";
import { getPreferences, getUserProfile, updatePreferences, updateUserProfile } from "../controllers/profileController";
const router = Router();
router.get("/getUser", getUserProfile);
router.post("/updateUser", updateUserProfile);
router.get("/getPreferences", getPreferences);
router.post("/updatePreferences", updatePreferences);
export default router;
