import mongoose, { ObjectId, Schema } from 'mongoose';
//INTERFACE
export interface CommentInterface {
    title: String;
    content: String;
    creatorID: ObjectId[];
    createdDate: Date;
    updatedDate: Date;
}

//SCHEMA
const CommentSchema: Schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
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
