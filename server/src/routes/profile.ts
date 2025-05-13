import { Router } from "express";
import { deleteAccount, getFriendsData, getPreferences, getUserProfile, updatePreferences, updateUserProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/auth";

const router = Router();
 
router.get("/getUser", authenticate, getUserProfile);
router.post("/updateUser", authenticate, updateUserProfile);
router.get("/getPreferences", authenticate, getPreferences);
router.post("/updatePreferences", authenticate, updatePreferences);
router.get("/getFriendsData", authenticate, getFriendsData);
router.post("/deleteUser", authenticate, deleteAccount);

export default router;
