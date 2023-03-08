import { Router } from "express";
import userRoutes from "./routes/user/index.js";

export default () => {
    const app = Router();

    userRoutes(app);

    return app;
};
