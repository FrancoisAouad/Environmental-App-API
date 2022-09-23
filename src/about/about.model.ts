import mongoose, { ObjectId, Schema } from 'mongoose';
//INTERFACE
export interface AboutInterface {}

//SCHEMA
const AboutSchema: Schema = new Schema({});

export default mongoose.model<AboutInterface>('About', AboutSchema);
