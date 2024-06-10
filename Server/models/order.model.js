import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    date: {
        type: String,
        default: new Date().toISOString()
    },

    deliveryDate: {
        type: String,
    },

    cart: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
            size: {
                type: String,
                default: "52"
            },
            color: {
                type: String,
                default: "Default"
            }
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

    paymentMethod: {
        type: String,
        default: "COD"
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

    Id: {
        type: String,
        default: ""
    },
    
}, {timestamps: true});

export const orderModel = new mongoose.model("Order", orderSchema);

