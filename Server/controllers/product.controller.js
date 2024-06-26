import { productModel } from "../models/product.model.js"
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary, deleteImage } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import stripe from "stripe";
import { cartItemModel } from "../models/cartItem.model.js";
import { orderModel } from "../models/order.model.js";

const options = {
    httpOnly: true,
    path: "/",
    sameSite: 'none',
    secure: true,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
}

const addProductController = asyncHandler(async (req, res) => {

    const { title, description, category, price, comparePrice, onTop, color } = req.body;

    if ([title, description, category, price, comparePrice].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "Some fields are missing");
    }

    const imagesRecieved = req.files;
    let images = [];

    for (let image of imagesRecieved) {
        const img = await uploadToCloudinary(image.path);
        images.push(img);
    }

    const product = await productModel.create({ title, description, category, price, comparePrice, images, onTop, color });

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

    if (product.image) {
        await deleteImage(product.image.publicId);
    } else {
        for (let image of product.images) {
            await deleteImage(image.publicId);
        }
    }

    await product.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Product Deleted Successfully"));

});

const getAllProductsController = asyncHandler(async (req, res) => {

    const { page } = req.query;
    const products = await productModel.aggregate([
        {
            '$match': {
                'onTop': true
            }
        },
        {
            '$skip': page * 12
        },
        {
            '$sample': {
                'size': 12
            }
        }
    ]);

    return res
        .status(200)
        .json(new ApiResponse(200, products, "All Products Fetched Successfully"));

});

const getProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if (!productId) {
        throw new ApiError(400, "No Product ID provided");
    }

    const product = await productModel.findById(productId);

    if(!product) throw new ApiError(404, "No Product Found");

    const products = await productModel.aggregate([
        {
            '$match': {
                'title': product.title
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

    return res
        .status(200)
        .json(new ApiResponse(200, products, "Product Fetched Successfully"));

});

const getSearchProductsController = asyncHandler(async (req, res) => {

    const { search } = req.query;

    const products = await productModel.aggregate([
        {
            '$match': {
                'title': {
                    '$regex': new RegExp(search),
                    '$options': 'i'
                }
            }
        },
        {
            '$sort': {
                'onTop': -1
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

    const { cart, isIndia, dirham_to_rupees, shippingDetails, deliveryCharge } = req.body;
    if (!cart) throw new ApiError("No Cart Given");

    const stripeObj = new stripe(process.env.STRIPE_SECRET_KEY)

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

    if (deliveryCharge) {
        items.push({
            price_data: {
                currency: isIndia ? 'inr' : 'aed',
                product_data: {
                    name: 'Delivery Charge',
                },
                unit_amount: isIndia ? deliveryCharge * 100 : Math.floor((deliveryCharge.price * 100) / dirham_to_rupees)
            },
            quantity: 1
        })
    }

    const session = await stripeObj.checkout.sessions.create({
        line_items: items,
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/#/success`,
        cancel_url: `${process.env.CLIENT_URL}/`,
        customer_email: shippingDetails.email
    });


    return res
        .status(200)
        .cookie("sessionId", session.id, options)
        .cookie("shippingDetails", JSON.stringify(shippingDetails), options)
        .cookie("cart", JSON.stringify(cart), options)
        .json(new ApiResponse(200, session, "Session Created Successfully"));
})

const retriveCheckoutSessionController = asyncHandler(async (req, res) => {

    const sessionId = req.cookies.sessionId;
    const shippingDetails = JSON.parse(req.cookies.shippingDetails);
    const cart = JSON.parse(req.cookies.cart);

    if (!sessionId) throw new ApiError(400, "No Session ID Found");

    const stripeObj = new stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripeObj.checkout.sessions.retrieve(sessionId);

    const cartItems = cart.map((item) => (
        {
            product: item.product[0]._id,
            quantity: item.quantity,
            color: item.color,
            size: item.size
        }
    ));

    await orderModel.create({
        cart: cartItems,
        user: req.user._id,
        shippingDetails,
        sessionId
    });

    await cartItemModel.deleteMany({ user: req.user._id })

    return res
        .status(200)
        .clearCookie("sessionId")
        .clearCookie("shippingDetails")
        .clearCookie("cart")
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