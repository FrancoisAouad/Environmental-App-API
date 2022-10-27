import tagModel from './tags.model';
import postModel from '../posts/post.model';
import error from 'http-errors';

class Service {
    constructor() {}

    async addTag(body: any) {
        const exists = await tagModel.findOne({
            name: body.name.toLowerCase(),
        });
        if (exists) throw new error.Conflict('Tag already exists..');
        return await tagModel.create({
            name: body.name.toLowerCase(),
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
    async editTag(body: any, params: any) {
        const exists = await tagModel.findOne({
            name: body.name.toLowerCase(),
        });
        if (exists) throw new error.Conflict('Tag already exists..');
        return tagModel.updateOne(
            { _id: params.tagId },
            {
                $set: {
                    name: body.name.toLowerCase(),
                },
            }
        );
    }
    async getPostsCreatedByUsers() {
        return await postModel.aggregate([
            {
                //group by creator id
                $group: {
                    _id: '$creatorID',
                    //push all notes for the same user inside this array
                    posts: {
                        $push: {
                            postID: '$_id',
                            // title: '$title',
                            content: '$content',
                            likes: '$likes',
                            comments: '$comments',
                            created: '$createdDate',
                            updated: '$updatedDate',
                        },
                    },
                },
            },
            {
                //jin user collection
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo',
                },
            },
            {
                $project: {
                    userID: { $arrayElemAt: ['$userInfo._id', 0] },
                    fullname: { $arrayElemAt: ['$userInfo.fullname', 0] },
                    username: { $arrayElemAt: ['$userInfo.username', 0] },
                    email: { $arrayElemAt: ['$userInfo.email', 0] },
                    notesCreated: { $size: '$posts' },
                    posts: '$posts',
                    _id: 0,
                },
            },
        ]);
    }
    async getPostsByTags(query: any) {
        // const tagsArray = req.query.tags;

        if (!query.tags) throw new error.NotFound('no tags selected..');
        const x = query.tags.split(',');

        let tagIDs: any = [];
        //loop to get the tags ID from document

        for (const name of x) {
            const tagexists = await tagModel.findOne({
                name: name,
            });
            // push the id of the current tag inside the tags embedded document array
            if (tagexists) tagIDs.push(tagexists._id);
        }
        let pipeline: any = [
            //first stage checks the tag swith only the input tags
            { $match: { tags: { $in: tagIDs } } },
            {
                //join the tags info from the collection
                $lookup: {
                    from: 'tags',
                    localField: 'tags',
                    foreignField: '_id',
                    as: 'tags',
                },
            },
            //third stage sorts by updatedDate
            {
                $sort: { updatedDate: -1 },
            },
            //final stage project the following fields
            {
                $project: {
                    _id: 1,
                    // title: 1,
                    content: 1,
                    creatorID: 1,
                    tags: '$tags.name',
                    created: '$createdAt',
                    updated: '$updatedAt',
                },
            },
            {
                //join the tags info from the collection
                $lookup: {
                    from: 'users',
                    localField: 'creatorID',
                    foreignField: '_id',
                    as: 'creatorID',
                },
            },
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    tag: { $first: '$tags' },
                    fullname: { $first: '$creatorID.fullname' },
                    username: { $first: '$creatorID.username' },
                    email: { $first: '$creatorID.email' },
                    totalTimes: { $sum: 1 },
                    posts: {
                        $push: {
                            postID: '$_id',
                            // title: '$title',
                            content: '$content',
                            comments: '$comments',
                            likes: '$likes',
                            created: '$created',
                            updated: '$updated',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    tag: 1,
                    fullname: { $arrayElemAt: ['$fullname', 0] },
                    username: { $arrayElemAt: ['$username', 0] },
                    email: { $arrayElemAt: ['$email', 0] },
                    totalTimes: 1,
                    comments: 1,
                    likes: 1,
                    posts: 1,
                },
            },
        ];
        return await postModel.aggregate(pipeline);
    }
}

export default Service;
