import mongoose,{Schema} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const tutorSchema=new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true 
    },
    name: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
        unique: true,
    },
    qualification:{
        type: String,
    },
    experience:{
        type: Number
    },
    subjectExpert:{
        type: String,
    },
    location:{
        type: String,
    },
    photo:{
        type: String,
    },
    demoVideo:{
        type: String,
    },
    password:{
        type: String,
        required: [true, 'Password is required']
    }
},{timestamps:true})

tutorSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10)
    }
    next()
})

tutorSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

tutorSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name:this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const Tutor=mongoose.model("Tutor",tutorSchema)
