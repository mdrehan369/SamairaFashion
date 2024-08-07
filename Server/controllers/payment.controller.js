import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import sha256 from "sha256"
import axios from "axios"
import { cartItemModel } from "../models/cartItem.model.js";
import { userModel } from "../models/user.model.js";
import { orderModel } from "../models/order.model.js";
import "dotenv/config.js"
import { sendSuccessMessage } from "./user.controller.js";
import mongoose from "mongoose";

const options = {
    httpOnly: true,
    path: "/",
    sameSite: 'none',
    secure: true,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
}

const phonepePayController = (req, res) => {

    const { cart, isIndia, dirham_to_rupees, shippingDetails } = req.body;
    let amount = 0;

    cart.map(cartItem => {
        amount += cartItem.product[0].price * 100 * cartItem.quantity;
    });

    if (shippingDetails.discount) {
        if (isIndia) {
            amount -= Math.floor(shippingDetails.discount / dirham_to_rupees) * 100;
        } else {
            amount -= shippingDetails.discount * 100;
        }
    }

    let userId = `MUID${Date.now()}`;

    let merchantTransactionId = Date.now();

    let normalPayLoad = {
        merchantId: process.env.PHONEPE_MERCHANT_ID,
        merchantTransactionId: merchantTransactionId,
        merchantUserId: userId,
        amount: amount, // converting to paise
        redirectUrl: `${process.env.CLIENT_URL}/#/success`,
        redirectMode: "REDIRECT",
        mobileNumber: shippingDetails.number,
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
    ).then(async function (response) {
        // res.redirect(response.data.data.instrumentResponse.redirectInfo.url);
        console.log(response.data)
        await userModel.findByIdAndUpdate(req.user._id, {
            shippingDetails
        });
        return res
        .status(200)
        .cookie("shippingDetails", shippingDetails, options)
        .json(new ApiResponse(200, {url: response.data.data.instrumentResponse.redirectInfo.url, id: response.data.data.merchantTransactionId}, "Checkout Initiated"))
    })
        .catch(function (error) {
            console.log(error)
            res.send(error);
        });

};

const phonepeCheckStatusController = asyncHandler(async (req, res) => {

    const { id, isBuyNow, product } = req.body;

    if (!id) throw new ApiError(400, "No Merchant ID");

    let statusUrl =
        `${process.env.PHONEPE_HOST_URL}/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/` +
        id;

    let string =
        `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/` + id + process.env.PHONEPE_SALT_KEY;
    let sha256_val = sha256(string);
    let xVerifyChecksum = sha256_val + "###" + process.env.PHONEPE_SALT_INDEX;

    const response = await axios.get(statusUrl, {
        headers: {
            "Content-Type": "application/json",
            "X-VERIFY": xVerifyChecksum,
            "X-MERCHANT-ID": id,
            accept: "application/json",
        },
    });

    if (response.data.code === "PAYMENT_SUCCESS") {

        // const cart = await cartItemModel.find({ user: req.user._id });

        // const cartItems = cart.map((item) => ({
        //     product: item.product,
        //     quantity: item.quantity,
        //     color: item.color,
        //     size: item.size
        // }))

        // await orderModel.create({
        //     cart: cartItems,
        //     user: req.user._id,
        //     shippingDetails,
        //     phonepeMerchantTransactionId: merchantTransactionId
        // });

        // await cartItemModel.deleteMany({ user: req.user._id })
        req.paymentId = id;
        req.payMethod = 'Phonepe';
        if (req.isBuyNow) {
            req.isBuyNow = isBuyNow;
            req.product = product;
        }
        next();
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

const sendEmailsController = asyncHandler(async (req, res) => {

    const order_id = req.order_id;
    if (!order_id) throw new ApiError(404, "No Order ID Given");

    const orderDetails = await orderModel.aggregate([
        {
            '$match': {
                '_id': new mongoose.Types.ObjectId(order_id)
            }
        }, {
            '$lookup': {
                'from': 'products',
                'localField': 'cart.product',
                'foreignField': '_id',
                'as': 'products',
                'pipeline': [
                    {
                        '$project': {
                            'title': 1,
                            'price': 1
                        }
                    }
                ]
            }
        }, {
            '$project': {
                'cart': 1,
                'shippingDetails': 1,
                'paymentMethod': 1,
                'products': 1
            }
        }
    ]);

    await sendSuccessMessage(orderDetails[0]);

    return res
        .status(200)
        .clearCookie("shippingDetails")
        .json(new ApiResponse(200, { success: true }))

})

const clearCartAndPlaceOrderController = asyncHandler(async (req, res, next) => {

    const cart = await cartItemModel.find({ user: req.user._id });

    if (req.isBuyNow) {

        const product = req.product;

        const cartItems = {
            product: product.productId,
            quantity: product.quantity,
            color: product.color,
            size: product.size
        }

        const order = await orderModel.create({
            cart: cartItems,
            user: req.user._id,
            shippingDetails: req.cookies.shippingDetails,
            Id: req.paymentId,
            paymentMethod: req.payMethod
        });

        req.order_id = order._id;

        // await sendSuccessMessage(req.cookies.shippingDetails.email, order._id.toString().slice(5, 10), [cartItems], req.cookies.shippingDetails);
        next();

    } else {

        const cartItems = cart.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            color: item.color,
            size: item.size
        }));

        const order = await orderModel.create({
            cart: cartItems,
            user: req.user._id,
            shippingDetails: req.cookies.shippingDetails,
            Id: req.paymentId,
            paymentMethod: req.payMethod
        });

        await cartItemModel.deleteMany({ user: req.user._id });
        req.order_id = order._id;

        next();
    }

})

const tabbyCheckoutController = async (req, res) => {

    try {
        const { cart, isIndia, dirham_to_rupees, shippingDetails } = req.body;

        const REF_ID = Date.now().toString();
        let amount = 0;
        const items = cart.map(cartItem => {
            amount += cartItem.product[0].price * 100 * cartItem.quantity;
            return {
                title: cartItem.product[0].title,
                quantity: cartItem.quantity,
                unit_price: cartItem.product[0].price * 100,
                category: 'Clothes'
            }
        });

        amount = Math.floor((amount / dirham_to_rupees));
        if (shippingDetails.deliveryCharge) {
            amount += shippingDetails.deliveryCharge * 100;
        }

        if (shippingDetails.discount) {
            if (isIndia) {
                amount -= Math.floor(shippingDetails.discount / dirham_to_rupees) * 100;
            } else {
                amount -= shippingDetails.discount * 100;
            }
        }

        const CHECKOUT_URL = 'https://api.tabby.ai/api/v2/checkout';
        const payload = {
            payment: {
                amount: amount,
                currency: "AED",
                buyer: {
                    phone: shippingDetails.number,
                    email: shippingDetails.email,
                    name: `${shippingDetails.firstName} ${shippingDetails.lastName}`
                },
                shipping_address: {
                    city: 'N/A',
                    address: shippingDetails.address,
                    zip: 'N/A'
                },
                order: {
                    reference_id: REF_ID,
                    items: items
                },
                buyer_history: {
                    registered_since: new Date().toISOString(),
                    loyalty_level: 0
                },
                order_history: []
            },
            lang: "ar",
            merchant_code: process.env.TABBY_MERCHANT_CODE,
            merchant_urls: {
                success: `${process.env.CLIENT_URL}/#/success`,
                cancel: `${process.env.CLIENT_URL}/#/checkoutPage`,
                failure: `${process.env.CLIENT_URL}/#/success`,
            }
        }

        const response = await axios.post(CHECKOUT_URL, payload, { headers: { Authorization: `Bearer ${process.env.TABBY_PUBLIC_KEY}` } });

        await userModel.findByIdAndUpdate(req.user._id, {
            shippingDetails
        });

        if (response.data.status !== 'rejected') {
            return res
                .status(200)
                .cookie("shippingDetails", shippingDetails, options)
                .json(new ApiResponse(200, { id: response.data.id, url: response.data.configuration.available_products.installments[0].web_url }, "Checkout Initiated"));
        } else {
            throw new ApiError(300, "Some Error Occurred While Creating A Checkout Session");
        }
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json(new ApiError(400, err.message));
    }

};

const ziinaCheckoutController = async (req, res) => {

    try {
        const { cart, isIndia, dirham_to_rupees, shippingDetails } = req.body;

        let amount = 0;
        let quantity = 0;
        cart.map(cartItem => {
            amount += cartItem.product[0].price * cartItem.quantity;
            quantity += cartItem.quantity;
        });
        amount = Math.floor(amount / dirham_to_rupees) * 100;
        if (shippingDetails.deliveryCharge) {
            amount += shippingDetails.deliveryCharge * 100;
        }

        if (shippingDetails.discount) {
            if (isIndia) {
                amount -= Math.floor(shippingDetails.discount / dirham_to_rupees) * 100;
            } else {
                amount -= shippingDetails.discount * 100;
            }
        }

        const CHECKOUT_URL = 'https://api-v2.ziina.com/api/payment_intent';
        const payload = {
            amount: amount,
            currency_code: 'AED',
            success_url: `${process.env.CLIENT_URL}/#/success`,
            cancel_url: process.env.CLIENT_URL,
            test: true
        }

        const response = await axios.post(CHECKOUT_URL, payload, { headers: { Authorization: `Bearer ${process.env.ZIINA_API_KEY}` } });

        await userModel.findByIdAndUpdate(req.user._id, {
            shippingDetails
        });

        return res
            .status(200)
            .cookie("shippingDetails", shippingDetails, options)
            .json(new ApiResponse(200, { id: response.data.id, url: response.data.redirect_url }, "Checkout Created SuccessFully"));
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .json(new ApiError(400, err.message));
    }

};

const retrieveTabbyCheckoutController = asyncHandler(async (req, res, next) => {

    const { id, isBuyNow, product } = req.body;

    const response = await axios.get(`https://api.tabby.ai/api/v2/checkout/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.TABBY_SECRET_KEY}`
        }
    });

    if (response.data.status === 'approved') {
        req.paymentId = id;
        req.payMethod = 'Tabby';
        if (req.isBuyNow) {
            req.isBuyNow = isBuyNow;
            req.product = product;
        }
        next();
    } else {
        return res
            .status(200)
            .json(new ApiResponse(200, { success: false }, "Retrieved"));
    }


});

const retrieveZiinaCheckoutController = asyncHandler(async (req, res, next) => {

    const { id, isBuyNow, product } = req.body;

    const response = await axios.get(`https://api-v2.ziina.com/api/payment_intent/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.ZIINA_API_KEY}`
        }
    });

    if (response.data.status === 'completed') {
        req.paymentId = id;
        req.payMethod = 'Ziina';
        if (isBuyNow) {
            req.isBuyNow = isBuyNow
            req.product = product
        }
        next();
    } else {
        return res
            .status(200)
            .json(new ApiResponse(200, { success: false }, "Retrieved"));
    }

});

export {
    phonepePayController,
    phonepeCheckStatusController,
    tabbyCheckoutController,
    retrieveTabbyCheckoutController,
    ziinaCheckoutController,
    retrieveZiinaCheckoutController,
    clearCartAndPlaceOrderController,
    sendEmailsController
}