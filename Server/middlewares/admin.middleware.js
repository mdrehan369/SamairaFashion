import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { userModel } from "../models/user.model.js";

export const verifyAdmin = asyncHandler(async (req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.log(token);
        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await userModel.findById(decodedToken?._id)

        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        if (user.email === 'admin') {
            req.user = user;
            next()
        } else {
            throw new ApiError(401, "Unauthorized");
        }

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})