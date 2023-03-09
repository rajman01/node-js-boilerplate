import logger from "../../helpers/logger.js";
import handleResponse from "../../helpers/response.js";
import { UserFilter } from "../../filters/index.js";
import { User } from "../../database/index.js";
import { hash, verifyHash, deleteFields } from "../../helpers/index.js";

export class UserController {
    constructor() {
        this.logger = logger;
        this.handleResponse = handleResponse;
        this.UserFilter = UserFilter;
        this.User = User;
    }

    async createUser({ data }) {
        this.logger.debug("Creating user");
        try {
            // check if email exists
            const checkEmail = await this.User.findOne({
                email: data.email,
            });

            if (checkEmail) {
                return this.handleResponse(400, "email already exists");
            }

            // check if phone number exists
            const checkPhone = await this.User.findOne({
                phone: data.phone,
            });

            if (checkPhone) {
                return this.handleResponse(400, "phone number already exists");
            }

            // hash password
            data.password = await hash(data.password);

            // create user
            const user = await this.User.create(this.UserFilter.createUserData({ data }));

            // delete hidden fields
            deleteFields(user["_doc"], this.User.getHiddenFields());

            return this.handleResponse(200, "user created successfully", { user });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }

    async updateUser({ user, data }) {
        logger.debug("Updating user");
        try {
            // check if email exists
            const checkEmail = await this.User.findOne({
                email: data.email,
            });

            if (checkEmail && user._id.toString() !== checkEmail._id.toString()) {
                return this.handleResponse(400, "user with that email already exists");
            }

            // check if phone number exists
            const checkPhone = await this.User.findOne({
                phone: data.phone,
            });

            if (checkPhone && user._id.toString() !== checkPhone._id.toString()) {
                return this.handleResponse(400, "user with that phone number already exists");
            }

            // update user
            const updatedUser = await this.User.findOneAndUpdate(
                { _id: user._id },
                this.UserFilter.updateUserData({ data, user }),
            );

            return this.handleResponse(200, "user update successfully", { user: updatedUser });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }

    async changePassword({ user, data }) {
        this.logger.debug("Changing user password");
        try {
            // check if old password is correct
            const isCorrect = await verifyHash(user.password, data.password);

            if (!isCorrect) {
                return this.handleResponse(400, "incorrect password");
            }

            // hash new password
            data.new_password = await hash(data.new_password);

            // update user password
            await this.User.findOneAndUpdate({ _id: user._id }, { password: data.new_password });

            return this.handleResponse(200, "password changed successfully");
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }

    async getUser({ user }) {
        logger.debug("Getting user");
        try {
            Reflect.deleteProperty(user, "password");
            return this.handleResponse(200, "user fetched successfully", { user });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }

    async listUsers({ query }) {
        logger.debug("Listing users");
        try {
            const users = await this.User.find(this.UserFilter.listUserQuery({ query }));

            return this.handleResponse(200, "users fetched successfully", { users });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }
}

export default new UserController();
