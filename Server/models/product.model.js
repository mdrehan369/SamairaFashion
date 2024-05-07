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

    image: {
        url: String,
        publicId: String
    },

    category: {
        type: String,
        required: true,
        trim: true
    },

    history: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            time: {
                type: Date,
                default: Date.now()
            }
        }
    ],

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
    
}, {timestamps: true});

export const productModel = new mongoose.model("Product", productSchema);

