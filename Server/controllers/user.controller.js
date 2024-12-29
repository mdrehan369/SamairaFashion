import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cartItemModel } from "../models/cartItem.model.js"
import mongoose from "mongoose";
import "dotenv/config.js"
import { Resend } from "resend";
import { sendOtpTemplate, orderConfirmationTemplate, orderConfirmationTemplateAdmin } from "../emailTemplates.js"

const resend = new Resend(process.env.RESEND_API_KEY);

const options = {
    httpOnly: true,
    path: "/",
    sameSite: 'none',
    secure: true,
    expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
}

const signupController = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, number, password } = req.body;
    if ([firstName, lastName, email, number, password].some((field) => field.trim() === '')) {
        throw new ApiError(400, "Some fields are missing");
    }

    const existeduser = await userModel.findOne({
        $or: [{ number }, { email }]
    });

    if (existeduser) {
        return res.status(400).json(new ApiResponse(400, {}, "User already exists"));
    }

    const user = await userModel.create({ firstName, lastName, email, number, password });
    const newUser = await user.save();

    newUser.password = "";
    const accessToken = user.generateAccessToken();

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, newUser, "New User Created Successfully"));

});

const sendEmail = async (to, subject, text) => {

    const { data, error } = await resend.emails.send({
        from: "support@samairafashion.in",
        to: [to],
        subject: subject,
        html: text,
    });

    if (error) {
        console.log(error)
        throw new ApiError(500, "Some Error Occured While Sending Email");
    }

    return data;

}

const sendOtpController = asyncHandler(async (req, res) => {

    const { email } = req.params;
    if (!email) throw new ApiError(400, "No Email");

    const otp = String(Math.random() * 10000).slice(0, 4);

    await sendEmail(email, 'Your One-Time Password (OTP) for Samaira Fashion', sendOtpTemplate(otp, email));

    return res
        .status(200)
        .json(new ApiResponse(200, otp, "OTP sent successfully"));

});

const sendSuccessMessage = async (orderDetails) => {

    await sendEmail(orderDetails.shippingDetails.email, 'Order Confirmation!', await orderConfirmationTemplate(orderDetails));
    await sendEmail(process.env.ADMIN_EMAIL, `New Order Successfully Processed!`, await orderConfirmationTemplateAdmin(orderDetails));

}

// const sendEmailToAdmin = async ()

const loginController = asyncHandler(async (req, res) => {

    const { email } = req.params;

    if (!email) throw new ApiError(400, "No Email");

    const user = await userModel.findOne({ email });

    if (!user) {

        const newUser = await userModel.create({ email });
        const accessToken = newUser.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, newUser, "New User Created Successfully"));

    }

    const accessToken = user.generateAccessToken();

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, user, "Logged In Successfully"));

});

const loginWithUUIDController = asyncHandler(async (req, res) => {

    const { uuid } = req.params;

    if (!uuid) throw new ApiError(400, "No UUID");

    const user = await userModel.findOne({ uuid: uuid });

    if (!user) {

        const newUser = await userModel.create({ uuid: uuid });
        const accessToken = newUser.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, newUser, "New User Created Successfully"));

    }

    const accessToken = user.generateAccessToken();

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, user, "Logged In Successfully"));

});

const googleSigninController = asyncHandler(async (req, res) => {

    const { id } = req.params;
    if (!id) throw new ApiError("No Google Id found");

    const user = await userModel.findOne({ googleId: id });

    if (!user) {

        const newUser = await userModel.create({ googleId: id });
        const accessToken = newUser.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, newUser, "New User Created Successfully"));

    }

    const accessToken = user.generateAccessToken();

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, user, "Orders Fetched Successfully"));

});

const facebookSigninController = asyncHandler(async (req, res) => {

    const { id } = req.params;
    if (!id) throw new ApiError("No Facebook Id found");

    const user = await userModel.findOne({ facebookId: id });

    if (!user) {

        const newUser = await userModel.create({ facebookId: id });
        const accessToken = newUser.generateAccessToken();

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .json(new ApiResponse(200, newUser, "New User Created Successfully"));

    }

    const accessToken = user.generateAccessToken();

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200, user, "Orders Fetched Successfully"));


})

const logoutController = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "User logged Out"))

});

const getCurrentUserController = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))

});

const addToCartController = asyncHandler(async (req, res) => {

    const { productId, quantity, size, color } = req.body;

    if (!productId) throw new ApiError(400, "No Product ID");

    const cartItem = await cartItemModel.findOne({ user: req.user._id, product: productId });

    if (cartItem) {
        cartItem.quantity += quantity;
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

const deleteCartItemController = asyncHandler(async (req, res) => {

    const { id } = req.params;

    await cartItemModel.findByIdAndDelete(id);

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

const getCartLengthController = asyncHandler(async (req, res) => {

    const cartItems = await cartItemModel.find({ user: req.user._id });

    return res
        .status(200)
        .json(new ApiResponse(200, cartItems.length, "Fetched"));

})

const updateCartController = asyncHandler(async (req, res) => {

    const { cartItemId, quantity } = req.query;
    if (!cartItemId || !quantity) throw new ApiError(400, "Some Queries Are Missing");

    if (quantity == 0) {
        await cartItemModel.findByIdAndDelete(cartItemId);
    } else {
        await cartItemModel.findByIdAndUpdate(cartItemId, { quantity });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Updated Successfully"))
})

export {
    signupController,
    loginController,
    logoutController,
    getCurrentUserController,
    addToCartController,
    getAllCartItems,
    updateCartController,
    deleteAllCartItemsController,
    deleteCartItemController,
    getCartLengthController,
    googleSigninController,
    sendOtpController,
    loginWithUUIDController,
    sendSuccessMessage,
    facebookSigninController
}