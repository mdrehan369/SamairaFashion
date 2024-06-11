import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { orderModel } from "../models/order.model.js"
import { userModel } from "../models/user.model.js"
import mongoose from "mongoose"
import { cartItemModel } from "../models/cartItem.model.js"
import { sendSuccessMessage } from "./user.controller.js"

const addOrderController = asyncHandler(async (req, res) => {

    const { cart, shippingDetails, sessionId } = req.body;

    if ([cart, shippingDetails, sessionId].some((value) => value === '')) throw new ApiError(400, "Some Fields Are Missing");

    const cartItems = cart.map((item) => (
        {
            product: item.product[0]._id,
            quantity: item.quantity,
            color: item.color,
            size: item.size
        }
    ));

    const newOrder = await orderModel.create({
        cart: cartItems,
        user: req.user._id,
        shippingDetails,
        paymentMethod: 'COD',
        paymentPending: true
    });

    await userModel.findByIdAndUpdate(req.user._id, {
        shippingDetails
    });

    await cartItemModel.deleteMany({ user: req.user._id });

    await userModel.findByIdAndUpdate(req.user._id, { shippingDetails });
    await sendSuccessMessage(shippingDetails.email, newOrder._id.toString().slice(0, 10), cartItems);


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

    let { all } = req.query;

    let orders = null;

    if (all !== 'user') {
        orders = await orderModel.aggregate([
            {
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
        ])

        return res
            .status(200)
            .json(new ApiResponse(200, orders, "Orders Fetched Successfully"));
    } else {

        orders = await orderModel.aggregate([
            {
                '$match': {
                    'user': new mongoose.Types.ObjectId(req.user._id)
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
    }

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

const getCountsController = asyncHandler(async (req, res) => {

    const counts = await orderModel.aggregate([
        {
            '$project': {
                '_id': 0,
                'pending': {
                    '$cond': [
                        {
                            '$eq': [
                                '$isPending', true
                            ]
                        }, 1, 0
                    ]
                },
                'cancelled': {
                    '$cond': [
                        {
                            '$eq': [
                                '$isCancelled', true
                            ]
                        }, 1, 0
                    ]
                },
                'delivered': {
                    '$cond': [
                        {
                            '$eq': [
                                '$isPending', false
                            ]
                        }, 1, 0
                    ]
                }
            }
        }, {
            '$group': {
                '_id': null,
                'pendingCount': {
                    '$sum': '$pending'
                },
                'cancelledCount': {
                    '$sum': '$cancelled'
                },
                'deliveredCount': {
                    '$sum': '$delivered'
                }
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200, { counts }, "Fetched Successfully"));

});

const getOrdersByDatesController = asyncHandler(async (req, res) => {

    let { to, from } = req.query;

    if (!from) {
        from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }

    if (!to) {
        to = new Date();
    }

    const orders = await orderModel.aggregate([
        {
            '$match': {
                'createdAt': {
                    '$gt': from,
                    '$lt': to
                }
            }
        }
    ]);

    let dataset = {};

    for (let order of orders) {
        dataset[order.createdAt] = order;
    }

    return res
        .status(200)
        .json(new ApiResponse(200, dataset, "Orders Fetched Successfully"));

})

export {
    addOrderController,
    markDeliveredController,
    cancelOrderController,
    getAllOrdersController,
    getOrderController,
    getCountsController,
    getOrdersByDatesController
}


