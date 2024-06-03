import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({

    number: {
        type: Number,
    },

    ipAddress: {
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

// userSchema.pre("save", async function(next) {
//     if(!this.isModified("password")) next();
//     this.password = await bcryptjs.hash(this.password, 10);
//     next();
// })

// userSchema.methods.verifyPassword = async function(password) {
//     return await bcryptjs.compare(password, this.password);
// }

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

