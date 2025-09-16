import { ApiResponses } from "../utils/api-responses.js";
import { ApiError } from "../utils/api-error.js";
import {User} from "../models/user.models.js"
import { asyncHandler } from "../utils/async-handler.js";
import {emailSender, emailVerificationMailContent} from "../utils/mail.js"


const generateAcessAndRefreshToken = async(userId) =>{
    try {
        const user = await User.findById(userId)
       const accessToken = user.generateAccessToken();
       const refreshToken = user.generateAccessToken();

       user.refreshToken = refreshToken
       await user.save({validateBeforeSave: false})

       return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating token")
    }
}

const registerUser = asyncHandler(async (req,res)=>{
    const {email, username, password, role} = req.body

   const exixtedUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(exixtedUser){
        throw new ApiError(409,"user with email or username already exixts",[])
    }

    const user = await User.create({
        email,
        password,
        username,
        isEmailVerified: false
    })

    const { hashedToken,unHashedToken,tokenExpiry} =user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken
    user.emailVerificationExpiry = tokenExpiry

    await user.save({validateBeforeSave:false})

    await emailSender({
        email: user?.email,
        subject: "please verify your email",
        mailContent: emailVerificationMailContent(user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`

        )
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponses(200,{user:createdUser},"user registered successfully verification mail is send")
    )
})

export {registerUser}