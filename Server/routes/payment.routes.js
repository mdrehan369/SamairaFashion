import express from "express";
import { phonepeCheckStatusController, phonepePayController } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route('/phonepe/pay').get(verifyJWT, phonepePayController);
router.route('/phonepe/check').post(verifyJWT, phonepeCheckStatusController);

export default router;