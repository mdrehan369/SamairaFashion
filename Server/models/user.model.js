import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    email: {
        type: String,
    },

    uuid: {
        type: String,
        trim: true
    },

    googleId: {
        type: String,
        trim: true
    },

    facebookId: {
        type: String,
        trim: true
    },

    shippingDetails: {
        email: String,
        country: String,
        firstName: String,
        lastName: String,
        address: String,
        nearBy: String,
        city: String,
        state: String,
        pincode: Number,
        number: Number,
    }

});

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const userModel = new mongoose.model("User", userSchema);

