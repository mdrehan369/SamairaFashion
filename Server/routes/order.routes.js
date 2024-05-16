import express from "express"
import { verifyAdmin } from "../middlewares/admin.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addOrderController,
    getAllOrdersController,
    markDeliveredController,
    cancelOrderController,
    getOrderController,
    updateOrderController
} from "../controllers/order.controller.js"

const router = express.Router();

router.route("/").post(verifyJWT, addOrderController);
router.route("/").get(verifyJWT, getAllOrdersController);
router.route("/order/:orderId").get(verifyJWT, getOrderController);
router.route("/order/:orderId").put(verifyJWT, updateOrderController);
router.route("/delivered/:orderId").get(verifyJWT, markDeliveredController);
router.route("/cancel/:orderId").get(verifyJWT, cancelOrderController);

export default router;