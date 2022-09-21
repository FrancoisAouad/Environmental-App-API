import tagModel from './tags.model';
// import globalService from '../utils/globalService';
import postModel from '../posts/post.model';
import error from 'http-errors';
// import tagsModel from './tags.model';
// const GlobalService = new globalService();

class Service {
    constructor() {}

    async addTag(body: any) {
        return await tagModel.create({
            name: body.name,
        });
    }
    async getTagByID(params: any) {
        return tagModel.findOne({ _id: params.tagId });
    }
    async getAllTags() {
        return await tagModel.aggregate([
            {
                $sort: {
                    updatedDate: -1,
                },
            },
        ]);
    }
    async deleteTag(params: any, header: any) {
        const exists = await tagModel.findOne({ _id: params.tagId });
        if (!exists) throw new error.NotFound('Tag not found...');

        const posts = await postModel.find({ tags: params.tagId });
        if (posts.length > 0) {
            await postModel.deleteMany({ tags: { $in: params.tagId } });
            return await tagModel.deleteOne({ _id: params.tagId });
        }

        return tagModel.deleteOne({ _id: params.tagId });
    }
    async editTag(body: any, header: any, params: any) {
        return tagModel.updateOne(
            { _id: params.tagId },
            {
                $set: {
                    name: body.name,
                },
            }
        );
    }
}
export default Service;
