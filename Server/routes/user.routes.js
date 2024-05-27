import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import {
<<<<<<< HEAD
    addToCartController,
    deleteAllCartItemsController,
    getAllCartItems,
    getCurrentUserController,
    loginController,
    logoutController,
    signupController,
    updateCartController
=======
    getAllUsersController,
    getCurrentUserController,
    loginController,
    logoutController,
    searchUserController,
    signupController
>>>>>>> admin
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/signup").post(signupController);
router.route("/signin").post(loginController);

//Protected Routes

router.route("/logout").get(verifyJWT, logoutController);
router.route("/user").get(verifyJWT, getCurrentUserController);
<<<<<<< HEAD
router.route("/cart").post(verifyJWT, addToCartController);
router.route("/cart").get(verifyJWT, getAllCartItems);
router.route("/cart").put(verifyJWT, updateCartController);
router.route("/cart").delete(verifyJWT, deleteAllCartItemsController);
=======
router.route("/").get(verifyAdmin, getAllUsersController);
router.route("/search").get(verifyAdmin, searchUserController);
>>>>>>> admin

export default router;