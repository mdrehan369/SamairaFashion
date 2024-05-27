import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cartItemModel } from "../models/cartItem.model.js"
import mongoose from "mongoose";

const options = {
    httpOnly: true,
    secure: false
}

const signupController = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, address, number, password } = req.body;
    if([firstName, lastName, email, address, number, password].some((field) => field.trim() === '')) {
        throw new ApiError(400, "Some fields are missing");
    }

    const existeduser = await userModel.findOne({
        $or: [{number}, {email}]
    });

    if(existeduser) {
        return res.status(400).json(new ApiResponse(400, {}, "User already exists"));
    }

    const user = await userModel.create({firstName, lastName, email, address, number, password});
    const newUser = await user.save();

    newUser.password = "";
    const accessToken = user.generateAccessToken();

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, newUser, "New User Created Successfully"));

});

const loginController = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if([email, password].some((field) => field.trim() === '')) {
        return res.status(400).json(new ApiResponse(400, {}, "Some fields are missing"));
    }

    const user = await userModel.findOne({email});

    if(!user) {
        return res.status(400).json(new ApiResponse(400, {}, "User does not exists"));
    }

    const isPass = await user.verifyPassword(password);

    if(!isPass) {
        return res.status(400).json(new ApiResponse(400, {}, "Password Incorrect"));
    }

    user.password = "";
    const accessToken = user.generateAccessToken();
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, user, "Logged In Successfully"));

});

const logoutController = asyncHandler(async(req, res) => {

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

});

const getCurrentUserController = asyncHandler(async(req, res) => {

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))

});

<<<<<<< HEAD
const addToCartController = asyncHandler(async(req, res) => {

    const { productId, quantity, size, color } = req.body;

    if(!productId) throw new ApiError(400, "No Product ID");

    const cartItem = await cartItemModel.findOne({ user: req.user._id, product: productId });

    if(cartItem) {
        cartItem.quantity += 1;
        await cartItem.save();
    } else {
        await cartItemModel.create({
            user: req.user._id,
            product: productId,
            quantity,
            size: size,
            color: color || 'default'
        });
    
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Added To Cart"));

});

const deleteAllCartItemsController = asyncHandler(async (req, res) => {

    await cartItemModel.delete({ user: req.user._id });

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "All Items Deleted"));

})

const getAllCartItems = asyncHandler(async (req, res) => {

    const cartItems = await cartItemModel.aggregate([
        {
          '$match': {
            'user': new mongoose.Types.ObjectId(req.user._id)
          }
        }, {
          '$lookup': {
            'from': 'products', 
            'localField': 'product',
            'foreignField': '_id', 
            'as': 'product'
          }
        }
      ]);
      

    return res
    .status(200)
    .json(new ApiResponse(200, cartItems, "Cart Fetched Successfully"));

})

const updateCartController = asyncHandler(async (req, res) => {

    const { cartItemId, quantity } = req.query;
    if(!cartItemId || !quantity) throw new ApiError(400, "Some Queries Are Missing");

    if(quantity == 0) {
        await cartItemModel.findByIdAndDelete(cartItemId);
    } else {
        await cartItemModel.findByIdAndUpdate(cartItemId, { quantity });
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Updated Successfully"))
=======
const getAllUsersController = asyncHandler(async(req, res) => {

    const users = await userModel.find({});

    res
    .status(200)
    .json(new ApiResponse(200, users, "All users fetched successfully"));

});

const searchUserController = asyncHandler(async(req, res) => {

    const { search } = req.query;

    if(!search) throw new ApiError(400, "No Search Query");

    const products = await userModel.aggregate([
        {
          '$match': {
            '$or': [
              {
                'firstName': {
                  '$regex': new RegExp(search), 
                  '$options': 'i'
                }
              }, {
                'lastName': {
                  '$regex': new RegExp(search), 
                  '$options': 'i'
                }
              }, {
                'number': {
                  '$regex': new RegExp(search), 
                  '$options': 'i'
                }
              }, {
                'email': {
                  '$regex': new RegExp(search), 
                  '$options': 'i'
                }
              }
            ]
          }
        }
      ]);

    res
    .status(200)
    .json(new ApiResponse(200, products, "products fetched"));


>>>>>>> admin
})

export {
    signupController,
    loginController,
    logoutController,
    getCurrentUserController,
<<<<<<< HEAD
    addToCartController,
    getAllCartItems,
    updateCartController,
    deleteAllCartItemsController
=======
    getAllUsersController,
    searchUserController
>>>>>>> admin
}