import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sha256 from "sha256"
import axios from "axios"
import { cartItemModel } from "../models/cartItem.model.js";
import { orderModel } from "../models/order.model.js";
import crypto from "crypto";
import "dotenv/config.js"

const phonepePayController = (req, res) => {

    const amount = +req.query.amount;

    let userId = `MUID${Date.now()}`;

    let merchantTransactionId = Date.now();

    let normalPayLoad = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId,
        amount: amount * 100, // converting to paise
        redirectUrl: `${process.env.CLIENT_URL}/success?phonepeMerchantTransactionID=${merchantTransactionId}`,
        redirectMode: "REDIRECT",
        mobileNumber: "6290197361",
        paymentInstrument: {
            type: "PAY_PAGE",
        },
    };

    let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    let base64EncodedPayload = bufferObj.toString("base64");

    let string = base64EncodedPayload + "/pg/v1/pay" + process.env.PHONEPE_SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + process.env.PHONEPE_SALT_INDEX;

    axios.post(
        `${process.env.PHONEPE_HOST_URL}/pg/v1/pay`,
        {
            request: base64EncodedPayload,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "X-VERIFY": xVerifyChecksum,
                accept: "application/json",
            },
        }
    ).then(function (response) {
        // res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
        res.send(response.data);
    })
        .catch(function (error) {
            res.send(error);
        });

};

const phonepeCheckStatusController = asyncHandler(async (req, res) => {

    const { merchantTransactionId, shippingDetails } = req.body;


    if (!merchantTransactionId) throw new ApiError(400, "No Merchant ID");

    let statusUrl =
        `${PHONE_PE_HOST_URL}/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/` +
        merchantTransactionId;

    let string =
        `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/` + merchantTransactionId + process.env.PHONEPE_SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + process.env.PHONEPE_SALT_INDEX;

    const response = await axios.get(statusUrl, {
        headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerifyChecksum,
            "X-MERCHANT-ID": merchantTransactionId,
            accept: "application/json",
        },
    });

    console.log("Response ->", response.data)

    if (response.data.code === "PAYMENT_SUCCESS") {

        const cart = await cartItemModel.find({ user: req.user._id });

        const cartItems = cart.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            color: item.color,
            size: item.size
        }))

        await orderModel.create({
            cart: cartItems,
            user: req.user._id,
            shippingDetails,
            phonepeMerchantTransactionId: merchantTransactionId
        });

        await cartItemModel.deleteMany({ user: req.user._id })
    }

    return res
        .status(200)
        .json(new ApiResponse(200, response.data, "Status Fetched Successfully"));

    // .then(function (response) {
    //     console.log("response->", response.data);
    //     if (response.data && response.data.code === "PAYMENT_SUCCESS") {
    //         // redirect to FE payment success status page
    //         res.send(response.data);
    //     } else {
    //         // redirect to FE payment failure / pending status page
    //     }
    // })
    // .catch(function (error) {
    //     // redirect to FE payment failure / pending status page
    //     res.send(error);
    // });

});

export {
    phonepePayController,
    phonepeCheckStatusController,
}