import { Router } from "express";
import { getUserProfile, updateUserProfile } from "../controllers/profileController";

const router = Router();
 
router.get("/getUser", getUserProfile);
router.post("/updateUser", updateUserProfile);

export default router;
