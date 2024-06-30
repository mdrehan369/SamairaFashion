import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { cartItemModel } from "../models/cartItem.model.js"
import mongoose from "mongoose";
import nodemailer from "nodemailer"

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

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text
    };
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        return response;
    } catch (error) {
        console.log('Error Occured while sending email');
        return error;
    }

}

const sendOtpController = asyncHandler(async (req, res) => {

    const { email } = req.params;
    if (!email) throw new ApiError(400, "No Email");

    const otp = String(Math.random() * 10000).slice(0, 4);

    await sendEmail(email, 'Your One-Time Password (OTP) for Samaira Fashion', `Hi ${email},\nThank you for using Samaira Fashion. To proceed with your request, please use the following One-Time Password (OTP):\nYour OTP: ${otp}\nThis OTP is valid for the next 10 minutes. Please do not share this code with anyone.If you did not request this code, please contact our support team immediately.\n\nThank you,\nSamaira Fashion\nContact Us:\nsamaira.shop1@gmail.com\n+97 15216 60581\nDeira, Dubai. UAE`);

    return res
        .status(200)
        .json(new ApiResponse(200, otp, "OTP sent successfully"));

});

const sendSuccessMessage = async (email, orderId, products, shippingDetails) => {

    const prodArr = products.map((prod) => {
        return `ProductId: #${prod.product},   Quantity:${prod.quantity},   Color:${prod.color},   Size:${prod.size}`
    });

    const productStr = prodArr.join('\n');

    await sendEmail(email, `Order Confirmation!`, `Thank you for your purchase from Samaira Fashion!\nYour order has been successfully placed and is being processed. Here are the details:\n\nOrder Number: #${orderId}\nOrder Summary:\n${productStr}\n\nYou can check other details of your order in our website.\nIf you have any questions or need further assistance, please feel free to contact our customer support.\n\nThank you for shopping with us!\nBest regards,\nSamaira Fashion`)
    await sendEmail(process.env.ADMIN_EMAIL, `Order Successfully Processed - Order #${orderId}`, `Hi Admin,\nI hope this message finds you well.\nI wanted to inform you that an order has been successfully processed through our system. Below are the details:\n\nOrder Number: #${orderId}\nOrder Date: ${new Date().toLocaleDateString()}\nCustomer Name: ${shippingDetails.firstName + ' ' + shippingDetails.lastName}\nCustomer Email: ${email}\n${productStr}\n\nShipping Address:\n${shippingDetails.address}\n${shippingDetails.country === 'India' && shippingDetails.city + ', ' + shippingDetails.state + ', ' + shippingDetails.pincode}\n${shippingDetails.country}`)

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
    sendSuccessMessage
}