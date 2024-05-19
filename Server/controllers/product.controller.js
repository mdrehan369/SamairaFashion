import { productModel } from "../models/product.model.js"
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary, deleteImage } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import stripe from "stripe";
import axios from "axios";
import { cartItemModel } from "../models/cartItem.model.js";
import { orderModel } from "../models/order.model.js";

const addProductController = asyncHandler(async (req, res) => {

    const { title, description, category, price, comparePrice } = req.body;

    if ([title, description, category, price, comparePrice].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "Some fields are missing");
    }

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "No Image Given");
    }

    const image = await uploadToCloudinary(imageLocalPath);

    const product = await productModel.create({ title, description, category, price, comparePrice, image });

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product Created Successfully"));

});

const deleteProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "No Product ID provided");
    }

    const product = await productModel.findById(productId);

    if (!product) {
        throw new ApiError(400, "No Product Found");
    }

    await deleteImage(product.image.publicId);
    await product.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product Deleted Successfully"));

});

const getAllProductsController = asyncHandler(async (req, res) => {

    const { page } = req.query;
    const products = await productModel.find({}).limit(12).skip(page * 12);

    return res
        .status(200)
        .json(new ApiResponse(200, products, "All Products Fetched Successfully"));

});

const getProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "No Product ID provided");
    }

    const product = await productModel.aggregate([
        {
            '$match': {
                '_id': new mongoose.Types.ObjectId(productId)
            }
        }, {
            '$lookup': {
                'from': 'reviews',
                'localField': '_id',
                'foreignField': 'product',
                'as': 'reviews'
            }
        }
    ]);

    if (!product) {
        throw new ApiError(400, "Wrong product ID");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, product, "Product Fetched Successfully"));

});

const getSearchProductsController = asyncHandler(async (req, res) => {

    const { search } = req.query;

    if (!search) throw new ApiError(400, "No Search Query");

    const products = await productModel.aggregate([
        {
            '$match': {
                'title': {
                    '$regex': new RegExp(search),
                    '$options': 'i'
                }
            }
        }
    ]);

    res
        .status(200)
        .json(new ApiResponse(200, products, "products fetched"));

});

const getProductsByCategory = asyncHandler(async (req, res) => {

    let { category, limit, attribute, order, page } = req.query;
    if (!category) {
        res.redirect("/")
        return;
    }

    if (!limit) {
        limit = 1000
    }

    if (!order) {
        order = -1;
    }

    if (!attribute) {
        attribute = 'createdAt'
    }

    limit = Number(limit);
    order = Number(order);

    const obj = [
        {
            '$match': {
                'category': category
            }
        },
        {
            '$sort': {
            }
        },
        {
            '$skip': page ? (page - 1) * limit : 0
        },
        {
            '$limit': limit
        }
    ];

    obj[1]['$sort'][attribute] = order;

    const products = await productModel.aggregate(obj);

    res
        .status(200)
        .json(new ApiResponse(200, products, "Products fetched"));

});

const createCheckoutSessionController = asyncHandler(async (req, res) => {

    const { cart, isIndia, dirham_to_rupees, shippingDetails } = req.body;
    if (!cart) throw new ApiError("No Cart Given");

    const stripeObj = new stripe('sk_test_51PGhn5JZgatvWpsFlm5HShtaCorWwyvHuLgR4XqMbHskZPtLfrFVoVsLVIvBSIuWcp3VGGP2OZommjs6qfgpAd6S00HiiERHKg')

    const items = cart.map((item) => {

        return {
        price_data: {
            currency: isIndia ? 'inr' : 'aed',
            product_data: {
                name: item.product[0].title,
            },
            unit_amount: isIndia ? item.product[0].price * 100 : Math.floor((item.product[0].price * 100) / dirham_to_rupees)
        },
        quantity: item.quantity
    }
});

    const cartIds = cart.map((item) => item._id);

    const response = await orderModel.create({
        cart: cartIds,
        user: req.user._id,
        sessionId: "none",
        shippingDetails
    });

    const session = await stripeObj.checkout.sessions.create({
        line_items: items,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `http://localhost:5173/success/${response._id}`
    });

    await orderModel.findByIdAndUpdate(response._id, { sessionId: session.id });

    return res
        .status(200)
        .json(new ApiResponse(200, session, "Session Created Successfully"));
})

const retriveCheckoutSessionController = asyncHandler(async (req, res) => {

    const { sessionId } = req.params;
    if(!sessionId) throw new ApiError(400, "No Session ID Found");

    const stripeObj = new stripe('sk_test_51PGhn5JZgatvWpsFlm5HShtaCorWwyvHuLgR4XqMbHskZPtLfrFVoVsLVIvBSIuWcp3VGGP2OZommjs6qfgpAd6S00HiiERHKg');

    const session = await stripeObj.checkout.sessions.retrieve(sessionId);

    return res
    .status(200)
    .json(new ApiResponse(200, session, "Session Retrieve Successfully"));

})

export {
    addProductController,
    deleteProductController,
    getAllProductsController,
    getProductController,
    getProductsByCategory,
    getSearchProductsController,
    createCheckoutSessionController,
    retriveCheckoutSessionController
}