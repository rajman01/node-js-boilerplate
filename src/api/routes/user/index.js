import { Router } from "express";
import logger from "../../../helpers/logger.js";
import handleResponse from "../../../helpers/response.js";
import { UserController } from "../../../controllers/user/index.js";
import { UserValidator } from "../../../validations/user/index.js";
import auth from "../../middlewares/auth.js";
import authRoutes from "./auth.js";

const router = Router();

export default app => {
    app.use("/user", router);

    authRoutes(router);

    const userController = new UserController();
    const userValidator = new UserValidator();

    router.post("/create", userValidator.createUser(), async (req, res) => {
        try {
            const response = await userController.createUser({
                data: req.body,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not create user", null, res);
        }
    });

    router.put("/update", auth, userValidator.updateUser(), async (req, res) => {
        try {
            const response = await userController.updateUser({
                user: req.user,
                data: req.body,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not update user", null, res);
        }
    });

    router.post("/password/change", auth, userValidator.changePassword(), async (req, res) => {
        try {
            const response = await userController.changePassword({
                user: req.user,
                data: req.body,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not change password", null, res);
        }
    });

    router.get("/get", auth, async (req, res) => {
        try {
            const response = await userController.getUser({
                user: req.user,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not get user", null, res);
        }
    });

    router.get("/list", auth, async (req, res) => {
        try {
            const response = await userController.listUsers({
                query: req.query,
            });
            return res.status(response.code).json(response);
        } catch (e) {
            logger.error(e);
            return handleResponse(500, "could not list users", null, res);
        }
    });
};
