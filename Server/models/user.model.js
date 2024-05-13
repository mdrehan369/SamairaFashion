import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    number: {
        type: Number,
        required: true,
        index: true
    },

    password: {
        type: String,
        trim: true,
        required: true
    },

    address: {
        type: String,
        trim: true
    },

    city: {
        type: String,
        trim: true  
    },

    pincode: {
        type: String,
        trim: true
    },

    state: {
        type: String,
        trim: true
    },

});

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) next();
    this.password = await bcryptjs.hash(this.password, 10);
    next();
})

userSchema.methods.verifyPassword = async function(password) {
    return await bcryptjs.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            number: this.number,
            email: this.email,
            _id: this._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const userModel = new mongoose.model("User", userSchema);

