import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js" 
import {User} from "../models//user.model.js"
import {uploadOnClousinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"; 

const registerUser = asyncHandler(async (req, res) => {
    /* THERE IS STEP BY STEP PROCESS OF LOGIC BUILDIG
    1) get user details from frontend
    2)validation - not empty
    3) ckeck if user already exist :- check username, email
    4)check for images, ckeck for avatar
    5)upload them to cloudinary, avatar
    6)create user object- create entry in DB
    7)remove password and refresh token field from response
    8)return response
    */

    const {fullName, email, username, password} = req.body
   //console.log("email:", email );

    if (  [
       fullName, email, username , password
    ].some 
    (    (field)  => field ?.  trim() === "")   ) 
    {
        throw new ApiError(400,"all field are required")
    } 
   const existedUser = await User.findOne({
        $or:[{username}, {email}]
    })
    if (existedUser) {
        throw new ApiError(409,"User with email or username already exists")

    }

    console.log(req.files );
     const avatarLocalPath = req.files?.avatar[0]?.path;
     // const coverImageLocalPath = req.files?.coverImage[0]?.path;

     let coverImageLocalPath;
     if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0) {
        coverImageLocalPath = req.files.coverImage[0].path;
     }
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar fiel is required")
    }
    const avatar = await uploadOnClousinary(avatarLocalPath)
    const coverImage = await uploadOnClousinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar fiel is required")
    }
    const  user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url ||"",
        email,
        password,
        username: username.toLowerCase() 
    })

   const createdUser =await User.findById(user._id).select(
    "-password -refreshToken"
   )

   if (!createdUser) {
       throw new ApiError(500,"Something went wrong while registring the user")
   }
   return res.statys(201).json(
    new ApiResponse(200,createdUser,"User registed successfully")
   ) 

})

export { registerUser }