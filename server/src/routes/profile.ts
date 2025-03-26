import { Router } from "express";
import { getFriendsData, getPreferences, getUserProfile, updatePreferences, updateUserProfile } from "../controllers/profileController";

const router = Router();
 
router.get("/getUser", getUserProfile);
router.post("/updateUser", updateUserProfile);
router.get("/getPreferences", getPreferences);
router.post("/updatePreferences", updatePreferences);
router.get("/getFriendsData", getFriendsData);

export default router;
