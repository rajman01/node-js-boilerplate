import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        deleted: {
            type: Boolean,
            default: false,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

postSchema.plugin(paginate);

const Post = mongoose.model("Post", postSchema);

export default Post;
