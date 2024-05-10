import express from "express"
import { verifyAdmin } from "../middlewares/admin.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addOrderController,
    getAllOrdersController,
    markDeliveredController,
    cancelOrderController
} from "../controllers/order.controller.js"

const router = express.Router();

router.route("/").post(verifyJWT, addOrderController);
router.route("/").get(verifyJWT, getAllOrdersController);
router.route("/delivered/:orderId").get(verifyJWT, markDeliveredController);
router.route("/cancel/:orderId").get(verifyJWT, cancelOrderController);

export default router;