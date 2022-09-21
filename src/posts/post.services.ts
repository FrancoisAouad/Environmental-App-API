import postModel from './post.model';
import globalService from '../utils/globalService';
const GlobalService = new globalService();

class Service {
    constructor() {}

    async addPost(body: any, header: any) {
        const id = GlobalService.getUser(header.authorization);
        return await postModel.create({
            title: body.title,
            content: body.content,
            tags: body.tags,
            creatorID: id,
        });
    }
    async getPostByID(params: any) {
        return postModel.findOne({ _id: params.postId });
    }
    async deletePost(params: any, header: any) {
        const id = GlobalService.getUser(header.authorization);
        return postModel.deleteOne({ _id: params.postId, creatorID: id });
    }
    async editPost(body: any, header: any, params: any) {
        const id = GlobalService.getUser(header.authorization);
        return postModel.updateOne(
            { _id: params.postId, creatorID: id },
            {
                $set: {
                    title: body.title,
                    content: body.content,
                    tags: body.tags,
                },
            }
        );
    }
    async getUserPosts(header: any) {
        const id = GlobalService.getUser(header.authorization);
        return postModel.find({ creatorID: id });
    }
    async getAllPosts() {
        return postModel.aggregate([
            {
                $sort: {
                    updatedDate: -1,
                },
            },
        ]);
    }
}
export default Service;
