import { Joi } from 'express-validation';

export const tagSchema = Joi.object({
    name: Joi.string().alphanum().lowercase().min(3).max(30).required(),
});
