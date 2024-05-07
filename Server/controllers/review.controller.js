import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { reviewModel } from "../models/review.model.js";
import { asyncHandler } from "../utils/asynchandler.js";
import mongoose from "mongoose";

const createReviewController = asyncHandler(async (req, res) => {

    const { title, description, rating, product } = req.body;

    if([title, description, rating, product].some((field) => field === '')) {
        throw new ApiError(400, "Some fields are missing");
    }

    const imagePath = req.file?.path;
    const user = req.user._id;

    let image = "";
    if(imagePath) {
        image = await uploadToCloudinary(imagePath);
    }

    const review = await reviewModel.create({
        title,
        description,
        rating,
        user,
        image,
        product
    });

    return res
    .status(200)
    .json(new ApiResponse(200, review, "Product Created Successfully"));

});

const getReviewsController = asyncHandler(async (req, res) => {

    const { product } = req.params;

    if(!product) throw new ApiError("No Product ID");

    const reviews = await reviewModel.aggregate([
        {
          '$match': {
            'product': new mongoose.Types.ObjectId(product)
          }
        }, {
          '$lookup': {
            'from': 'users', 
            'localField': 'user', 
            'foreignField': '_id', 
            'pipeline': [
              {
                '$project': {
                  'firstName': 1, 
                  'lastName': 1, 
                  'email': 1
                }
              }
            ], 
            'as': 'userObj'
          }
        }, {
          '$sort': {
            'createdAt': -1
          }
        }
      ]);

    res
    .status(200)
    .json(new ApiResponse(200, reviews, "Fetched Successfully"));

})

export {
    createReviewController,
    getReviewsController
}
