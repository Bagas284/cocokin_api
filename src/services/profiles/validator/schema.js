import Joi from "joi";

export const profilePayloadSchema = Joi.object({
    name: Joi.string(),
    bio: Joi.string().allow('', null).max(25),
    location: Joi.string().allow('', null),
}).min(1);