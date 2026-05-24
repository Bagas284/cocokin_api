import Joi from 'joi';

export const documentPayloadSchema = Joi.object({
  target_role: Joi.string().optional(),
});