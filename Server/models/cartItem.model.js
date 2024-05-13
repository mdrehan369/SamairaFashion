import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },

    quantity: {
        type: Number,
        default: 1
    },

    size: {
        type: Number,
        default: 0
    },

    color: {
        type: String
    }

});

export const cartItemModel = new mongoose.model("CartItem", cartItemSchema);

