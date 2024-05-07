import { productModel } from "../models/product.model.js"
import { asyncHandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadToCloudinary, deleteImage } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addProductController = asyncHandler(async(req, res) => {

    const { title, description, category, price, comparePrice } = req.body;

    if([title, description, category, price, comparePrice].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "Some fields are missing");
    }

    const imageLocalPath = req.file?.path;

    if(!imageLocalPath) {
        throw new ApiError(400, "No Image Given");
    }

    const image = await uploadToCloudinary(imageLocalPath);

    const product = await productModel.create({title, description, category, price, comparePrice, image});

    return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Created Successfully"));

});

const deleteProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if(!productId) {
        throw new ApiError(400, "No Product ID provided");
    }

    const product = await productModel.findById(productId);

    if(!product) {
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
    const products = await productModel.find({}).limit(12).skip(page*12);

    return res
    .status(200)
    .json(new ApiResponse(200, products, "All Products Fetched Successfully"));

});

const getProductController = asyncHandler(async (req, res) => {

    const { productId } = req.params;

    if(!productId) {
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

    if(!product) {
        throw new ApiError(400, "Wrong product ID");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, product, "Product Fetched Successfully"));

});

const getSearchProductsController = asyncHandler(async (req, res) => {

    const { search } = req.query;

    if(!search) throw new ApiError(400, "No Search Query");

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

    let { category, limit } = req.query;
    if(!category) {
        res.redirect("/")
        return;
    }

    if(!limit) {
      limit = 1000
    }

    limit = Number(limit);

    const products = await productModel.aggregate([
        {
          '$match': {
            'category': category
          }
        }, {
          '$sort': {
            'createdAt': -1
          }
        }, {
          '$limit': limit
        }
      ]);

    res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched"));

})

export {
    addProductController,
    deleteProductController,
    getAllProductsController,
    getProductController,
    getProductsByCategory,
    getSearchProductsController
}