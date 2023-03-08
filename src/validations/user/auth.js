import { Validation } from "../index.js";

export class AuthValidator extends Validation {
    constructor() {
        super();
    }

    loginValidationRule() {
        return {
            email: "required|string|email",
            password: "required|string",
        };
    }

    login() {
        return (req, res, next) => {
            const validationRules = this.loginValidationRule();
            this.validator(req.body, validationRules, {}, (err, status) => {
                if (!status) {
                    this.sendError(res, err);
                } else {
                    next();
                }
            });
        };
    }
}

export default new AuthValidator();
