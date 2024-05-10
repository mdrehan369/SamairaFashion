import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    isPending: {
        type: Boolean,
        default: true
    },

    isCancelled: {
        type: Boolean,
        default: false
    },

    size: {
        type: Number,
        default: 0
    },

    color: {
        type: String,
        trim: true
    },

    quantity: {
        type: Number,
        default: 1
    },

    address: {
        type: String,
        required: true
    },

    comment: {
        type: String
    }
});

export const orderModel = new mongoose.model("Order", orderSchema);

