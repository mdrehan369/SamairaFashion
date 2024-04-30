import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const options = {
    httpOnly: true,
    secure: true
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

})

const getCurrentUserController = asyncHandler(async(req, res) => {

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        req.user,
        "User fetched successfully"
    ))

})

export {
    signupController,
    loginController,
    logoutController,
    getCurrentUserController
}