import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    getCurrentUserController,
    loginController,
    logoutController,
    signupController
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/signup").post(signupController);
router.route("/signin").post(loginController);

//Protected Routes

router.route("/logout").get(verifyJWT, logoutController);
router.route("/user").get(verifyJWT, getCurrentUserController)

export default router;