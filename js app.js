import express from "express";
import cors from "cors";
import cookieParse from "cookie-parser";

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true    
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParse())

//routes
import tutorRouter from "./routes/tutor.routes.js";
app.use("/api/tutor",tutorRouter)

import studentRouter from "./routes/student.routes.js";
app.use("/api/student",studentRouter) 

export default app
