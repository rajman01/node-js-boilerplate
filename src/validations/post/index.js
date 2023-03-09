import { Validation } from "../index.js";

export class PostValidator extends Validation {
    constructor() {
        super();
    }

    createPostValidationRule() {
        return {
            title: "required|string",
            body: "required|string",
        };
    }

    createPost() {
        return (req, res, next) => {
            const validationRules = this.createPostValidationRule();
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

export default new PostValidator();
