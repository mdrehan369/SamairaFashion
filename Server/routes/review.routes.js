import { 
    createReviewController,
    getReviewsController
} from "../controllers/review.controller.js";
import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/review/:product").get(getReviewsController);

// Protected Routes

router.route("/").post(verifyJWT, upload.single('image'), createReviewController);

export default router;
