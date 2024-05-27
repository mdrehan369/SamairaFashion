import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { orderModel } from "../models/order.model.js"
import { userModel } from "../models/user.model.js"
import mongoose from "mongoose"

const addOrderController = asyncHandler(async (req, res) => {

    const { cart, shippingDetails, sessionId } = req.body;

    if ([cart, shippingDetails, sessionId].some((value) => value === '')) throw new ApiError(400, "Some Fields Are Missing");

    const newOrder = await orderModel.create({
        cart,
        user: req.user._id,
        sessionId,
        shippingDetails
    });

    return res
        .status(200)
        .json(new ApiResponse(200, newOrder, "Order Placed Successfully"));

});

const getOrderController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;
    if (!orderId) throw new ApiError(400, "No OrderID");

    const order = await orderModel.findById(orderId);

    return res
        .status(200)
        .json(new ApiResponse(200, order, "Order Fetched Successfully"));
})

const markDeliveredController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    if (!orderId) throw new ApiError(400, "No OrderID Given");

    const order = await orderModel.findById(orderId);

    if (!order) throw new ApiError("No Order Found");

    order.isPending = false;
    await order.save();

    return res.
        status(200)
        .json(new ApiResponse(200, {}, "Marked"));

});

const getAllOrdersController = asyncHandler(async (req, res) => {

    let { userId } = req.query;

    if (!userId) {
        userId = req.user._id;
    } else {
        const user = await userModel.findById(userId);
        if (!user) throw new ApiError(401, "No User Found");
    }

    const orders = await orderModel.aggregate([
        {
            '$match': {
                'user': new mongoose.Types.ObjectId(userId)
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
                            'description': 0,
                            'itemsSold': 0,
                            'history': 0,
                            'createdAt': 0,
                            'updatedAt': 0
                        }
                    }
                ]
            }
        }, {
            '$project': {
                'sessionId': 0,
                'phonepeMerchantTransactionId': 0
            }
        }, {
            '$sort': {
                'createdAt': -1
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, orders, "Orders Fetched Successfully"));

});

const cancelOrderController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    if (!orderId) throw new ApiError(400, "No OrderId Found");

    const order = await orderModel.findById(orderId);

    if (!order) throw new ApiError(401, "No Order Found");

    order.isCancelled = true;
    await order.save();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Order Cancelled Successfully"));

});

export {
    addOrderController,
    markDeliveredController,
    cancelOrderController,
    getAllOrdersController,
    getOrderController,
}


