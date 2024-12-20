import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import {storageModel} from "../models/storage.model.js";
import { Admin } from "../models/admin.model.js";
import { billingSchema } from "../models/billingdetails.model.js";
import { Product } from "../models/product.model.js";
import fs from "fs";
import {uploadOnCloudinary} from "../utils/cloudinary.js";

const VerifyUserdetails = asyncHandler(async (req, res) => {
    try {
        const { username, email, password, number } = req.body;
        if (!(username && number && email && password)) {
            throw new ApiError(400, "All fields are compulsory");
        }
        // Checking if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new ApiError(409, "User with this email already exists");
        }
        return res.status(285).json(new ApiResponse(285, req.body, "Please verify OTP"));
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const registerUser = asyncHandler(async (req, res) => {
    try {
        const { username, email, password, number } = req.body;
        if (!(username && number && email && password)) {
            throw new ApiError(400, "All fields are compulsory");
        }

        // Create a new user
        const user = await User.create({
            username: username.toLowerCase(), email, password, number
        });

        const createdUser = await User.findById(user._id).select("-refreshToken");
        if (!createdUser) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        if (createdUser && await createdUser.isPasswordCorrect(password)) {
            const refreshToken = createdUser.RefreshAccessToken();
            const accessToken = createdUser.generateAccessToken();
            createdUser.refreshToken = refreshToken;

            await createdUser.save();
            createdUser.password = undefined;
            createdUser.refreshToken = undefined;

            // Sending tokens in cookies
            const Aoptions = {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 60 * 60 * 1000 // 1 hour
            };
            const Roptions = {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            };

            res
                .status(200)
                .cookie("refreshToken", refreshToken, Roptions)
                .cookie("accessToken", accessToken, Aoptions)
                .json(new ApiResponse(200, { user: createdUser }, "User registered and logged in successfully"));
        } else {
            throw new ApiError(401, "Something went wrong");
        }
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            throw new ApiError(400, "Email and password both are required");
        }

        const user = await User.findOne({ email });
        if (!user) {
            const admin = await Admin.findOne({ email }).select("-number");
            if (admin && await admin.isPasswordCorrect(password)) {
                return res.status(285).json(new ApiResponse(285, admin, "Admin exists, please verify OTP"));
            } else {
                throw new ApiError(401, "Password is incorrect");
            }
        }

        if (user && await user.isPasswordCorrect(password)) {
            const refreshToken = user.RefreshAccessToken();
            const accessToken = user.generateAccessToken();
            user.refreshToken = refreshToken;

            await user.save();
            user.password = undefined;
            user.refreshToken = undefined;

            // Send cookies and response
            res.status(200)
                .cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                })
                .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 60 * 60 * 1000 // 1 hour
                })
                .json(new ApiResponse(200, { user }, "User logged in successfully"));
        } else {
            throw new ApiError(401, "Password is incorrect");
        }
    } catch (error) {
        // Properly send the error to the frontend
        res.status(error.statusCode || 500).json({
            statusCode: error.statusCode || 500,
            message: error.message || "An error occurred",
            success: false,
            errors: error.errors || [],
        });
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        if (req.admin) {
            await Admin.findByIdAndUpdate(
                req.admin._id,
                { $set: { refreshToken: undefined } },
                { new: true }
            );

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            };
            return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse(200, {}, "Admin logged out"));
        } else if (req.user) {
            await User.findByIdAndUpdate(
                req.user._id,
                { $set: { refreshToken: undefined } },
                { new: true }
            );

            const options = {
                httpOnly: true,
                secure: true,
                sameSite: 'None',
            };

            return res
                .status(200)
                .clearCookie("accessToken", options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse(200, {}, "User logged out"));
        } else {
            return res.json(new ApiResponse(404, {}, "Please log in to move further"));
        }
    } catch (error) {
        throw new ApiError(401, "Error: ", error);
    }
});

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }
    
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched"));
});

const billingDetails = asyncHandler(async (req, res) => {
    const { firstName, lastName, address, city, postCode, phoneNumber, cart } = req.body;
    if (!(firstName && lastName && address && city && postCode && cart)) {
        throw new ApiError(400, "All fields are compulsory");
    }

    const billing = await billingSchema.create({
        firstName, lastName, address, city, postCode, cart, owner: req.user._id, phoneNumber
    });

    res.status(200).json(new ApiResponse(200, { billing }, "Billing details saved successfully"));
});

const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};

const searchProduct = asyncHandler(async (req, res) => {
    const { query } = req.query; // Get the search query from the URL

    if (!query) {
        return res.status(400).json({ message: 'Query is required' });
    }

    try {
        const products = await Product.find({
            productName: { $regex: query, $options: 'i' } // Case-insensitive search
        }).limit(10); // Limit to 10 results

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const orders = asyncHandler(async (req, res) => {
    try {
        const ordersUser = await billingSchema.find({ customer: req.user._id });
        res.status(200).json(new ApiResponse(200, { ordersUser }, "Orders details fetched successfully"));
    } catch (error) {
        console.log("Catch error");
        res.status(500).json({ message: 'Server error or no orders found' });
    }
});
const addStorage = asyncHandler(async (req, res) => {
    try {
        const localPaths = req.files?.['productImages[]']?.map(file => file.path) || [];       
        if(!localPaths || localPaths.length === 0) {
            throw new ApiError(400,"Product image is required");
        }
        const { 
            areaLength, 
            areaWidth, 
            climate, 
            location, 
            price, 
            storageType, 
            securityFeatures, 
            availabilityPeriod 
        } = req.body;
        if (!(areaLength && areaWidth && climate && location && price && storageType)) {
            fs.unlinkSync(localPaths);
            throw new ApiError(400, "All fields are compulsory");
        }
        const imageUrls = []; // Array to store image URLs

        for (const localpath of localPaths) {
            try {
                const image = await uploadOnCloudinary(localpath); // Attempt upload
                if (!image) {
                    throw new Error("Image upload failed");
                }
                imageUrls.push(image.url);
            } catch (error) {
                console.error(`Error uploading file at ${localpath}:`, error.message);
                if (fs.existsSync(localpath)) {
                    fs.unlinkSync(localpath); // Cleanup file
                    console.log(`Deleted local file: ${localpath}`);
                }
                throw new ApiError(500, "Something went wrong while uploading the image");
            }
        }      
        // Create storage rental with image URLs
        const storage = await storageModel.create({
            areaLength, 
            areaWidth, 
            climate, 
            location, 
            price,
            storageType, 
            securityFeatures, 
            availabilityPeriod,
            productImages: imageUrls, // Save image URLs in the images array
        });
        res.status(201).json(
            new ApiResponse(200,  storage , "Storage added successfully with images")
        );
    } catch (error) {
        if (req.files) {
            req.files['productImages[]'].forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }
        res.status(error.statusCode || 500).json({ 
            message: error.message || 'Something went wrong' 
        });
    }
});
const myproducts = asyncHandler(async (req, res) => {
    try {
        const myproductsdata = await Product.find({ owner: req.user._id });
        res.status(200).json(new ApiResponse(200,{myproductsdata},"Grains details fetched successfully"));
    } catch (error){
        console.log("Catch error");
        res.status(500).json({ message: 'Server error or no orders found' });
    }
});

const PersonalStorageSearch = asyncHandler(async (req, res) => {
    try {
        const storageData = await storageModel.find({owner:req.user_id});
        res.status(200).json(new ApiResponse(200,{storageData}," user's storage space fetched successfully"));
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const UniversalStorageSearch = asyncHandler(async (req, res) => {
    try {
        // Fetch storage data and exclude the storage spaces belonging to the current user (req.user_id)
        if(req.user){
            const storageData = await storageModel.find({ owner: { $ne: req.user_id } });  // '$ne' means "not equal"
            res.status(200).json(new ApiResponse(200, {storageData} , "Storage spaces fetched successfully"));
        }else if(req.user === undefined || req.user === null){ 
            const storageData = await storageModel.find({});
            res.status(200).json(new ApiResponse(200, {storageData} , "Storage spaces fetched successfully"));
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


export {PersonalStorageSearch,UniversalStorageSearch,searchProduct, VerifyUserdetails, registerUser, loginUser, logoutUser, getCurrentUser, billingDetails, orders, changePassword,addStorage };
