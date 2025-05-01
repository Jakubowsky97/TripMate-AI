"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const profileController_1 = require("../controllers/profileController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET endpoint do potwierdzenia e-maila (np. poprzez link)
router.get("/confirm", auth_1.authenticate, authController_1.confirmEmail);
router.get("/checkEmail", auth_1.authenticate, authController_1.checkEmailVerification);
router.post("/savePreferences", auth_1.authenticate, authController_1.saveUserPreferences);
router.get("/getUser", auth_1.authenticate, profileController_1.getUserProfile);
router.post("/updateUser", auth_1.authenticate, profileController_1.updateUserProfile);
exports.default = router;
