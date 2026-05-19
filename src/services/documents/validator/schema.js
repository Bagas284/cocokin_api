import Joi from 'joi';

export const documentPayloadSchema = Joi.object({
  portofolio_url: Joi.string().required(),
  target_role: Joi.string(),
});