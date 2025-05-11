import asyncHandler from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { Tutor } from "../models/tutor.model.js"
import { Post } from "../models/post.model.js"
import uploadOnCloudinary from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessTocken = async (Id) => {
    try {
        const tutor = await Tutor.findById(Id)
        const accessToken = tutor.generateAccessToken()
        await tutor.save({ validateBeforeSave: false })
        return { accessToken }
    } catch (error) {
        throw new apiError(500, "something went to wrong while genereting token")
    }
}

const registerTutor = asyncHandler(async (req, res) => {
    const { email, name, contactNumber, qualification, experience, subjectExpert, location, password } = req.body
    // console.log("email :", email)
    if ([email, password].some((field) =>
        field?.trim() === ""
    )) {
        return res.status(400).json(new ApiResponse(400, {}, "All field are required"));
    }

    const existedTutor = await Tutor.findOne({
        email
    })
    if (existedTutor) {
        return res.status(409).json(new ApiResponse(409, {}, "email alraedy exisxt"));
    }
    const photoLocalPath = req.files?.photo[0]?.path
    // const coverImageLocalPath=req.files?.coverImage[0]?.path
    let demoVideoLocalPath;
    if (req.field && Array.isArray(req.files.demoVideo) && req.files.demoVideo.length > 0) {
        demoVideoLocalPath = req.files?.demoVideo[0]?.path
    }

    if (!photoLocalPath) {
        return res.status(400).json(new ApiResponse(400, {}, "photo is required"));
    }

    const photo = await uploadOnCloudinary(photoLocalPath)
    const demoVideo = await uploadOnCloudinary(demoVideoLocalPath)

    if (!photo) {
        return res.status(400).json(new ApiResponse(400, {}, "photo uploading error"));
    }

    const tutor = await Tutor.create({
        name,
        email,
        photo: photo.url,
        demoVideo: demoVideo?.url || "",
        contactNumber,
        qualification,
        experience,
        subjectExpert,
        location,
        password,
    })

    const createdTutor = await Tutor.findById(tutor._id).select(
        "-password"
    )
    if (!createdTutor) {
        throw new apiError(500, "something went to wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdTutor, "User Register successfully")
    )

})

const loginTutor = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email) {
            return res.status(400).json(new ApiResponse(400, {}, "email is required"));
        }
        const tutor = await Tutor.findOne({
            email
        })

        if (!tutor) {
            return res.status(404).json(new ApiResponse(404, {}, "id does not exist"));
        }
        const isPasswordValid = await tutor.isPasswordCorrect(password)

        if (!isPasswordValid) {
            return res.status(404).json(new ApiResponse(404, {}, "Password incorrect"));
        }

        const { accessToken } = await generateAccessTocken(tutor._id)

        const logedInTutor = await Tutor.findById(tutor._id).select(
            "-password"
        )

        const options = { //can not modify by user , only modified by user
            httpOnly: true,
            secure: true
        }

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        tutor: logedInTutor, accessToken
                    },
                    "loged in successfully"
                )
            )
    } catch (error) {
        res.status(401).json({ msg: "some other error" });
    }


})

const logoutTutor = asyncHandler(async (req, res) => {
    const options = { //can not modify by user , only modified by user
        httpOnly: true,
        secure: true
    }

    return res.status(200)
        .clearCookie("accessToken", options)
        .json(new ApiResponse(200, {}, "loged Out successfully"))
})

const createPost = asyncHandler(async (req, res) => {
    try {
        const { description, title } = req.body
        const post = await Post.create({
            tutor: req.tutor._id,
            description: description,
            title: title || ""
        })
        if (post) {
            return res.status(200).json(new ApiResponse(200, {}, "Post uploaded Successfully"))
        }

    } catch (error) {
        res.status(401).json({ msg: "some error while creating a post" });
    }
})

const getAllPost = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const getAllTutor = asyncHandler(async (req, res) => {
    try {
        const tutors = await Tutor.find();
        res.status(200).json(tutors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const getTutor = asyncHandler(async (req, res) => {
    try {
        const { tutorId } = req.params;
        const tutor = await Tutor.findById(tutorId); // Find tutor by ID in MongoDB
        
        if (!tutor) {
            return res.status(404).json({ message: 'Tutor not found' });
        }

        res.json(tutor); // Respond with tutor data
    } catch (error) {
        console.error("Error fetching tutor:", error);
        res.status(500).json({ message: 'Server error' });
    }
})


export { registerTutor, loginTutor, logoutTutor, createPost, getAllPost ,getTutor,getAllTutor}
