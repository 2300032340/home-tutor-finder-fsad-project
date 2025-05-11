import asyncHandler from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import {Student} from "../models/student.model.js";

const generateAccessTocken=async(Id)=>{
    try {
        const student=await Student.findById(Id)
        const studentAccessToken=student.generateAccessToken()
        await student.save({validateBeforeSave: false})
        return {studentAccessToken}
    } catch (error) {
        throw new apiError(500,"something went to wrong while genereting token")
    }
}

const registerStudent = asyncHandler(async (req, res) => {
    const { email, name, location,course, password, subject } = req.body
    if ([email, password].some((field) =>
        field?.trim() === ""
    )) {
        return res.status(400).json(new ApiResponse(400, {}, "email and password field are required"));
    }

    const existedStudent = await Student.findOne({
        email
    })
    if (existedStudent) {
        return res.status(409).json(new ApiResponse(409, {}, "email alraedy exisxt"));
    }

    const student = await Student.create({
        name,
        email,
        course: course || "",
        subject: subject || "",
        location,
        password,
    })

    const createdStudent = await Student.findById(student._id).select(
        "-password"
    )
    if (!createdStudent) {
        throw new apiError(500, "something went to wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdStudent, "Register successfully")
    )

})

const loginStudent=asyncHandler(async (req,res)=>{
    try {
        const {email,password}=req.body
        if(!email){
            return res.status(400).json(new ApiResponse(400,{},"email is required"));
        }
        const student=await Student.findOne({
            email
        })

        if(!student){
            return res.status(404).json(new ApiResponse(404,{},"id does not exist"));
        }
        const isPasswordValid=await student.isPasswordCorrect(password)
    
        if(!isPasswordValid){
            return res.status(404).json(new ApiResponse(404,{},"Password incorrect"));
        }
    
        const {studentAccessToken}=await generateAccessTocken(student._id)
    
        const logedInStudent=await Student.findById(student._id).select(
            "-password"
        )
    
        const options= { //can not modify by user , only modified by user
            httpOnly: true,
            secure: true
        }
    
        return res.status(200)
        .cookie("studentAccessToken",studentAccessToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    student: logedInStudent, studentAccessToken
                },
                "loged in successfully"
            )
        )
    } catch (error) {
        res.status(401).json({msg:"some other error"});
    }


})

export { registerStudent ,loginStudent}
