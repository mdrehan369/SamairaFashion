import express from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    addOrderController,
    getAllOrdersController,
    markDeliveredController,
    cancelOrderController,
    getOrderController,
    getCountsController,
} from "../controllers/order.controller.js"

const router = express.Router();

router.route("/").post(verifyJWT, addOrderController);
router.route("/").get(verifyJWT, getAllOrdersController);
router.route("/count").get(verifyJWT, getCountsController);
router.route("/order/:orderId").get(verifyJWT, getOrderController);
router.route("/delivered/:orderId").get(verifyJWT, markDeliveredController);
router.route("/cancel/:orderId").get(verifyJWT, cancelOrderController);

export default router;