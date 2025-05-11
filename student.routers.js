import {Router} from "express";
import { loginStudent, registerStudent} from "../controllers/student.controller.js";




const studentRouter=Router()
studentRouter.route("/register").post(registerStudent)
studentRouter.route("/login").post(loginStudent)

export default studentRouter
