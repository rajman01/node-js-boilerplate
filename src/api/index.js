import { Router } from "express";
import userRoutes from "./routes/user/index.js";
import postRoutes from "./routes/post/index.js";

export default () => {
    const app = Router();

    userRoutes(app);
    postRoutes(app);

    return app;
};
