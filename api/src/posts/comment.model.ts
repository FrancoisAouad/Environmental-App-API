import mongoose, { ObjectId, Schema } from 'mongoose';
//INTERFACE
export interface CommentInterface {
    comment: String;
    postID: ObjectId;
    creatorID: ObjectId[];
    createdDate: Date;
    updatedDate: Date;
}

//SCHEMA
const CommentSchema: Schema = new Schema({
    comment: {
        type: String,
        required: true,
    },
    postID: {
        type: mongoose.Types.ObjectId,
        ref: 'Post',
    },
    creatorID: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model<CommentInterface>('Comment', CommentSchema);
