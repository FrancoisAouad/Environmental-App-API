import { Joi } from 'express-validation';

export const registerSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }),
    fullname: Joi.string().lowercase(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
        .min(6)
        .max(48)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.ref('password'),
});

export const loginSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
    }),
    password: Joi.string()
        .min(6)
        .max(48)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.ref('password'),
});

export const resetPassSchema = Joi.object({
    password: Joi.string()
        .min(6)
        .max(48)
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmPassword: Joi.ref('password'),
});
