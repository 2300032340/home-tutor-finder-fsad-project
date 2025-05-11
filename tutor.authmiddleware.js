import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import {Tutor} from "../models/tutor.model.js"



const verifyTutorJWT=asyncHandler(async(req,res,next)=>{
    try {
        const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new apiError(401,"Unauthorized request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const tutor=await Tutor.findById(decodedToken._id).select("-password")
    
        if(!tutor){
            throw new apiError(401, "Invalid Access token")
        }
    
        req.tutor=tutor
        next()
    } catch (error) {
        res.status(401).json({msg:"You are not logged in"});
    } 

})

export {verifyTutorJWT}
