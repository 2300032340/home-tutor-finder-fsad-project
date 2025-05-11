import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        //await mongoose.connect("mongodb://127.0.0.1:27017/HomeTutorFinder")
        console.log(`Database connection successfully`)
    } catch (error) {
        console.log("MongoDB connection Failed",error);
        process.exit(1);
    }
}

export default connectDB;
