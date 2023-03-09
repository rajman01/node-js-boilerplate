import { Router } from "express";
import logger from "../../../helpers/logger.js";
import handleResponse from "../../../helpers/response.js";
import { PostController } from "../../../controllers/post/index.js";
import { PostValidator } from "../../../validations/post/index.js";
import auth from "../../middlewares/auth.js";

const router = Router();

export default app => {
    app.use("/post", router);

    const postController = new PostController();
    const postValidator = new PostValidator();

    router.post("/create", auth, postValidator.createPost(), async (req, res) => {
        try {
            const response = await postController.createPost({
                data: req.body,
                user: req.user,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not create post", null, res);
        }
    });

    router.get("/list", auth, async (req, res) => {
        try {
            const response = await postController.listPosts({
                query: req.query,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not list posts", null, res);
        }
    });
};
