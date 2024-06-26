import express from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addProductController,
    createCheckoutSessionController,
    deleteProductController,
    getAllProductsController,
    getProductController,
    getProductsByCategory,
    getSearchProductsController,
    retriveCheckoutSessionController
} from "../controllers/product.controller.js";
import { upload } from "../utils/cloudinary.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/").get(getAllProductsController);
router.route("/product/:productId").get(getProductController);
router.route("/search").get(getSearchProductsController);

//Protected Routes

router.route("/product").post(upload.array("images"), addProductController);
router.route("/product/:productId").delete(deleteProductController);
router.route("/category").get(getProductsByCategory);
router.route("/create-checkout").post(verifyJWT, createCheckoutSessionController);
router.route("/retrieve").get(verifyJWT, retriveCheckoutSessionController);

export default router;