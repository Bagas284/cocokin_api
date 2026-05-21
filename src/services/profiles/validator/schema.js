import Joi from "joi";

export const profilePayloadSchema = Joi.object({
    bio: Joi.string().allow('', null),
    location: Joi.string().allow('', null),
}).min(1);