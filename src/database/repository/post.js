import Base from "./base.js";
import Post from "../models/post.js";

export class PostRepo extends Base {
    constructor() {
        super(Post);
    }

    async create(data) {
        data = this.processData(data, []);
        return await this.baseCreate(data);
    }

    async update(query, data) {
        return this.baseUpdate(query, data);
    }
}

export default new PostRepo();
