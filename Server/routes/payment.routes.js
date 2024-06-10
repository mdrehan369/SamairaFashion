import express from "express";
import { clearCartAndPlaceOrderController, phonepeCheckStatusController, phonepePayController, retrieveTabbyCheckoutController, retrieveZiinaCheckoutController, tabbyCheckoutController, ziinaCheckoutController } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route('/phonepe/pay').get(verifyJWT, phonepePayController);
router.route('/phonepe/check').post(verifyJWT, phonepeCheckStatusController);
router.route('/tabby/pay').post(verifyJWT, tabbyCheckoutController);
router.route('/tabby/check').post(verifyJWT, retrieveTabbyCheckoutController, clearCartAndPlaceOrderController);
router.route('/ziina/pay').post(verifyJWT, ziinaCheckoutController);
router.route('/ziina/check').post(verifyJWT, retrieveZiinaCheckoutController, clearCartAndPlaceOrderController);

export default router;