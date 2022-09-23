import mongoose, { Schema } from 'mongoose';
//admin adds list of tags
interface TagInterface {
    name: String;
    createdAt: Date;
    updatedAt: Date;
}
const TagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
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

TagSchema.index({ name: 1 });
TagSchema.index({ updatedDate: -1 });
export default mongoose.model<TagInterface>('Tag', TagSchema);
