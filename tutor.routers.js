import {Router} from "express";
import { upload } from "../middlewares/multer.middlewares.js";
import { registerTutor,loginTutor,logoutTutor,createPost, getAllPost, getTutor, getAllTutor } from "../controllers/tutor.controller.js";
import {verifyTutorJWT} from "../middlewares/tutor.auth.middleware.js"
 


const tutorRouter=Router()
tutorRouter.route("/register").post(
    upload.fields([ 
        {
            name:"photo",
            maxCount:1
        },
        {
            name:"demoVideo",
            maxCount:1
        },
    ]),
    registerTutor
)
tutorRouter.route("/login").post(loginTutor)
tutorRouter.route("/logout").post(verifyTutorJWT,logoutTutor)
tutorRouter.route("/createPost").post(verifyTutorJWT,createPost)
tutorRouter.route("/getAllPost").get(getAllPost)
tutorRouter.route("/getAllTutor").get(getAllTutor)
tutorRouter.route("/:tutorId").get(getTutor)


export default tutorRouter
