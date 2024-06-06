import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    images: [
        {
            url: String,
            publicId: String
        }
    ],

    color: {
        type: String
    },

    onTop: {
        type: Boolean,
        default: false
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: Number,
        required: true,
    },

    comparePrice: {
        type: Number,
        required: true,
    },

    itemsSold: {
        type: Number,
        default: 0
    },

    reviews: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }

}, { timestamps: true });

export const productModel = new mongoose.model("Product", productSchema);

