import logger from "../../helpers/logger.js";
import handleResponse from "../../helpers/response.js";
import { Post } from "../../database/index.js";
import { PostFilter } from "../../filters/index.js";
import { deleteFields } from "../../helpers/index.js";

export class PostController {
    constructor() {
        this.logger = logger;
        this.handleResponse = handleResponse;
        this.Post = Post;
        this.PostFilter = PostFilter;
    }

    async createPost({ data, user }) {
        this.logger.debug("Creating post");
        try {
            // create post
            const post = await this.Post.create({
                title: data.title,
                body: data.body,
                user: user._id,
            });

            // delete hidden fields
            deleteFields(post["_doc"], this.Post.getHiddenFields());

            return this.handleResponse(200, "post created successfully", { post });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }

    async listPosts({ query }) {
        this.logger.debug("Listing posts");
        try {
            const postQuery = this.PostFilter.listPostQuery({ query });
            console.log(postQuery);

            const posts = await this.Post.find(postQuery, "", null, "user");

            return this.handleResponse(200, "posts listed successfully", { posts });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }
}
