import { Router } from "express";
import { getFriendsData, getPreferences, getUserProfile, updatePreferences, updateUserProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/auth";

const router = Router();
 
router.get("/getUser", authenticate, getUserProfile);
router.post("/updateUser", authenticate, updateUserProfile);
router.get("/getPreferences", authenticate, getPreferences);
router.post("/updatePreferences", authenticate, updatePreferences);
router.get("/getFriendsData", authenticate, getFriendsData);

export default router;
