"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = async (req, res, next) => {
    const token = req.cookies?.access_token;
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return; // 🚨 MUSISZ zrobić return po odpowiedzi
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return; // 🚨 Tutaj też return
    }
};
exports.authenticate = authenticate;
