import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asynchandler.js"
import { orderModel } from "../models/order.model.js"
import { productModel } from "../models/product.model.js"
import { userModel } from "../models/user.model.js"

const addOrderController = asyncHandler(async (req, res) => {

    const { product, size, quantity, color, address, comment } = req.body;

    if([product, size, address, quantity].some((value) => value === '')) throw new ApiError(400, "Some Fields Are Missing");

    const isValidProduct = await productModel.findById(product);

    if(!isValidProduct) throw new ApiError(401, "No Product Found");

    const newOrder = await orderModel.create({
        product,
        user: req.user._id,
        size,
        color,
        address,
        comment,
        quantity
    });

    return res
    .status(200)
    .json(new ApiResponse(200, newOrder, "Order Placed Successfully"));

});

const markDeliveredController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    if(!orderId) throw new ApiError(400, "No OrderID Given");

    const order = await orderModel.findById(orderId);

    if(!order) throw new ApiError("No Order Found");

    order.isPending = false;
    await order.save();

    return res.
    status(200)
    .json(new ApiResponse(200, {}, "Marked"));

});

const getAllOrdersController = asyncHandler(async (req, res) => {

    let { userId } = req.query;

    if(!userId) {
        userId = req.user._id;
    } else {
        const user = await userModel.findById(userId);
        if(!user) throw new ApiError(401, "No User Found");
    }

    const orders = await orderModel.find({ user: userId });

    return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders Fetched Successfully"));

});

const cancelOrderController = asyncHandler(async (req, res) => {

    const { orderId } = req.params;

    if(!orderId) throw new ApiError(400, "No OrderId Found");

    const order = await orderModel.findById(orderId);

    if(!order) throw new ApiError(401, "No Order Found");

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
    getAllOrdersController
}


