import logger from "../../helpers/logger.js";
import handleResponse from "../../helpers/response.js";
import { UserFilter } from "../../filters/index.js";
import { User } from "../../database/index.js";
import { verifyHash, deleteFields } from "../../helpers/index.js";
import { generateJwtToken } from "../../helpers/jwt.js";

export class AuthController {
    constructor() {
        this.logger = logger;
        this.handleResponse = handleResponse;
        this.User = User;
    }

    async login({ data }) {
        logger.debug("Logging in user");
        try {
            const user = await this.User.findOne(
                {
                    email: data.email,
                },
                "+password",
            );

            if (!user) {
                return this.handleResponse(400, "invalid email or password");
            }

            const passwordMatch = await verifyHash(user.password, data.password);

            if (!passwordMatch) {
                return this.handleResponse(400, "invalid email or password");
            }

            // generate token
            const token = await generateJwtToken({ ...user["_doc"] });

            // delete hidden fields
            deleteFields(user["_doc"], this.User.getHiddenFields());

            return this.handleResponse(200, "login successful", { user, token });
        } catch (e) {
            this.logger.error(e);
            return this.handleResponse(500, e);
        }
    }
}

export default AuthController;
