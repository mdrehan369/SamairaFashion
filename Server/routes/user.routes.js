import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addToCartController,
    deleteAllCartItemsController,
    deleteCartItemController,
    facebookSigninController,
    getAllCartItems,
    getCartLengthController,
    getCurrentUserController,
    googleSigninController,
    loginController,
    loginWithUUIDController,
    logoutController,
    sendOtpController,
    signupController,
    updateCartController
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/signup").post(signupController);
router.route("/signin/:email").get(loginController);
router.route('/googleSignin/:id').get(googleSigninController)

//Protected Routes

router.route("/logout").get(verifyJWT, logoutController);
router.route("/user").get(verifyJWT, getCurrentUserController);
router.route("/cart").post(verifyJWT, addToCartController);
router.route("/cart").get(verifyJWT, getAllCartItems);
router.route("/cart").put(verifyJWT, updateCartController);
router.route("/cart").delete(verifyJWT, deleteAllCartItemsController);
router.route("/cart/:id").delete(verifyJWT, deleteCartItemController);
router.route("/cartLength").get(verifyJWT, getCartLengthController);
router.route("/send/:email").get(sendOtpController);
router.route("/uuid/:uuid").get(loginWithUUIDController);
router.route("/facebookLogin/:id").get(facebookSigninController);

export default router;