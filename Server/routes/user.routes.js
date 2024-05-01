import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
    getAllUsersController,
    getCurrentUserController,
    loginController,
    logoutController,
    searchUserController,
    signupController
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/signup").post(signupController);
router.route("/signin").post(loginController);

//Protected Routes

router.route("/logout").get(verifyJWT, logoutController);
router.route("/user").get(verifyJWT, getCurrentUserController);
router.route("/").get(verifyAdmin, getAllUsersController);
router.route("/search").get(verifyAdmin, searchUserController);

export default router;