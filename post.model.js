import mongoose,{Schema} from "mongoose";

const postSchema = new Schema({
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  title: {
    type: String,
  },
  description: {
    type: String,
    required: true
  },
  
},{timestamps: true});

export const Post=mongoose.model("Post",postSchema)
