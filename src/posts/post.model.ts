import mongoose, { ObjectId, Schema } from 'mongoose';
//INTERFACE
export interface PostInterface {
    title: String;
    content: String;
    tags: ObjectId[];
    likes: Number;
    comments: ObjectId[];
    reports: Number;
    isBlocked: Boolean;
    isDeleted: Boolean;
    createdDate: Date;
    updatedDate: Date;
}

//SCHEMA
const PostSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    tags: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Tag',
            default: null,
        },
    ],
    likes: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'Comment',
        },
    ],
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    reports: {
        type: Number,
        default: 0,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdDate: {
        type: Date,
        default: Date.now(),
    },
    updatedDate: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model<PostInterface>('Post', PostSchema);
