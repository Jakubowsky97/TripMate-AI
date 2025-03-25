"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const profileController_1 = require("../controllers/profileController");
const router = (0, express_1.Router)();
// GET endpoint do potwierdzenia e-maila (np. poprzez link)
router.get("/confirm", authController_1.confirmEmail);
router.get("/checkEmail", authController_1.checkEmailVerification);
router.post("/savePreferences", authController_1.saveUserPreferences);
router.get("/getUser", profileController_1.getUserProfile);
router.post("/updateUser", profileController_1.updateUserProfile);
router.post("/login", authController_1.login);
router.post("/loginGoogle", authController_1.loginWithGoogle);
exports.default = router;
