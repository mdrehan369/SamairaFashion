import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
    addToCartController,
    deleteAllCartItemsController,
    getAllCartItems,
    getCurrentUserController,
    loginController,
    logoutController,
    signupController,
    updateCartController
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/signup").post(signupController);
router.route("/signin").post(loginController);

//Protected Routes

router.route("/logout").get(verifyJWT, logoutController);
router.route("/user").get(verifyJWT, getCurrentUserController);
router.route("/cart").post(verifyJWT, addToCartController);
router.route("/cart").get(verifyJWT, getAllCartItems);
router.route("/cart").put(verifyJWT, updateCartController);
router.route("/cart").delete(verifyJWT, deleteAllCartItemsController);

export default router;