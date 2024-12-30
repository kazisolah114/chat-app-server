import express from "express";
import { otherUsers, userData, userLogin, userLogout, userRegister } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/logout", userLogout);
router.get("/others", isAuthenticated, otherUsers);
router.get("/", isAuthenticated, userData);

export default router;