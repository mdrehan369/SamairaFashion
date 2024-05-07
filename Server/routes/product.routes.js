import express from "express";
// import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addProductController,
    deleteProductController,
    getAllProductsController,
    getProductController,
    getProductsByCategory,
    getSearchProductsController
} from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/").get(getAllProductsController);
router.route("/product/:productId").get(getProductController);
router.route("/search").get(getSearchProductsController);

//Protected Routes

router.route("/product").post(verifyAdmin, upload.single("image"), addProductController);
router.route("/product/:productId").delete(verifyAdmin, deleteProductController);
router.route("/category").get(getProductsByCategory);

export default router;