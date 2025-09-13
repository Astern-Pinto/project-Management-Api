import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"


const userSchema = new Schema(
    {
        avatar: {
            type: {
                url: String,
                localPath: String,
            },
            default: {
                url: `https://placehold.co/50x50`,
                localPath: ``
            }
        },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required: [true, "PAssword is required"]
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        refreshToken: {
            type: String
        },
        forgetPasswordToken: {
            type: String
        },
        forgetPasswordExpiry: {
            type: Date
        },
        emailVerificationToken: {
            type: String
        },
        emailVerificationExpiry: {
            type: Date
        }

    }, {
    timestamps: true,
},
);




userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//Here we are comparing password isPasswordCorrect is a user defined method 
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function (){
    return jwt.sign({
        id : this._id,
        username : this.username,
        email : this.email
    },
    process.env.JWT_ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY
    }
)
}



userSchema.methods.generateRefreshToken = function (){
    return jwt.sign({
        id : this._id     
    },
    process.env.JWT_REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY
    }
)
}

userSchema.methods.generateTemporaryToken = function(){
    const unHashedToken = crypto.randomBytes(20).toString("hex")
    const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex")

    const tokenExpiry = Date.now() + (20 * 60 * 1000) //20 minntes in milliseconds  

    return{
        hashedToken,
        unHashedToken,
        tokenExpiry
    }
}


export const User = mongoose.model("User", userSchema);