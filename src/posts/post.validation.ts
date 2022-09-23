import { Joi } from 'express-validation';

export const postSchema = Joi.object({
    title: Joi.string().alphanum().lowercase().min(3).max(16).required(),
    content: Joi.string().min(1).max(204).required(),
    //tags:Joi.ObjectID
});
