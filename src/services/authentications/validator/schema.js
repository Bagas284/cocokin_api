import Joi from 'joi';
export const postAuthenticationPayloadSchema = Joi.object({
  email: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
});

export const putAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

export const deleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required(),
});