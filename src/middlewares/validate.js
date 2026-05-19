import deleteFile from "../utils/delete-file.js";

export const validate = (schema) => async (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    if (req.file) {
      await deleteFile(req.file.path);
    }

    return next(error);
  }

  req.validated = value;
  next();
};