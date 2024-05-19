import mongoose from "mongoose"
import bcryptjs from 'bcryptjs'

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    cart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CartItem",
            required: true
        }
    ],

    isPending: {
        type: Boolean,
        default: true
    },

    isCancelled: {
        type: Boolean,
        default: false
    },

    paymentPending: {
        type: Boolean,
        default: false
    },

    shippingDetails: {
        firstName: String,
        lastName: String,
        country: String,
        state: String,
        city: String,
        address: String,
        pinCode: Number,
        nearBy: String,
        email: String,
        number: Number
    },

    sessionId: {
        type: String
    }
});

export const orderModel = new mongoose.model("Order", orderSchema);

