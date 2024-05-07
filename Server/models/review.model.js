import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({

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

    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },

    image: {
        url: String,
        publicId: String
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true});

export const reviewModel = new mongoose.model("Review", reviewSchema);

