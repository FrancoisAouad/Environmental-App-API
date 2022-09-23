import tagModel from './tags.model';
import postModel from '../posts/post.model';
import error from 'http-errors';

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
    async getPostsCreatedByUsers() {
        // let pipeline = [
        //     {
        //         //group by creator id
        //         $group: {
        //             _id: '$creatorID',
        //             //push all notes for the same user inside this array
        //             posts: {
        //                 $push: {
        //                     postID: '$_id',
        //                     title: '$title',
        //                     content: '$content',
        //                     likes: '$likes',
        //                     comments: '$comments',
        //                     created: '$createdDate',
        //                     updated: '$updatedDate',
        //                 },
        //             },
        //         },
        //     },
        //     {
        //         //jin user collection
        //         $lookup: {
        //             from: 'users',
        //             localField: '_id',
        //             foreignField: '_id',
        //             as: 'userInfo',
        //         },
        //     },
        //     {
        //         $project: {
        //             userID: { $arrayElemAt: ['$userInfo._id', 0] },
        //             fullname: { $arrayElemAt: ['$userInfo.fullname', 0] },
        //             username: { $arrayElemAt: ['$userInfo.username', 0] },
        //             email: { $arrayElemAt: ['$userInfo.email', 0] },
        //             notesCreated: { $size: '$posts' },
        //             notes: '$posts',
        //             _id: 0,
        //         },
        //     },
        // ];
        return await postModel.aggregate([
            {
                //group by creator id
                $group: {
                    _id: '$creatorID',
                    //push all notes for the same user inside this array
                    posts: {
                        $push: {
                            postID: '$_id',
                            title: '$title',
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
                    notes: '$posts',
                    _id: 0,
                },
            },
        ]);
    }
    async getPostsByTags(query: any) {
        // const tagsArray = req.query.tags;
        if (!query.tags) return;
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
                    title: 1,
                    content: 1,
                    tags: '$tags.name',
                    fullname: '$fullname',
                    username: '$username',
                    email: '$email',
                    created: '$createdDate',
                    updated: '$updatedDate',
                },
            },
            { $unwind: '$tags' },
            {
                $group: {
                    _id: '$tags',
                    tag: { $first: '$tags' },
                    fullname: { $first: '$fullname' },
                    username: { $first: '$username' },
                    email: { $first: '$email' },
                    totalTimes: { $sum: 1 },
                    posts: {
                        $push: {
                            postID: '$_id',
                            title: '$title',
                            content: '$content',
                            created: '$created',
                            updated: '$updated',
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    posts: 1,
                    fullname: 1,
                    username: 1,
                    email: 1,
                    tag: 1,
                    totalTimes: 1,
                },
            },
        ];
        return await postModel.aggregate(pipeline);
    }
}

export default Service;
