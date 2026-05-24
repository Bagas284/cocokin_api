import Joi from "joi";

export const emailPayloadSchema = Joi.object({
    email: Joi.string().min(3).max(50).required(),
});

export const otpPayloadSchema = Joi.object({
    email: Joi.string().min(3).max(50).required(),
    otp: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required(),
});

export const passwordPayloadSchema = Joi.object({
    email: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
});