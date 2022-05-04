import { Joi } from 'express-validation';

const BaseValidator = {
  signup: {
    body: Joi.object({
      username: Joi.string().required().min(4).trim(),
      password: Joi.string().required().min(8),
    }),
  },
  login: {
    body: Joi.object({
      username: Joi.string().required().min(4).trim(),
      password: Joi.string().required().min(8),
    }),
  },
  updatePassword: {
    body: Joi.object({
      currentPassword: Joi.string().required().min(8),
      newPassword: Joi.string().required().min(8),
      confirmPassword: Joi.string().required().min(8),
    }),
  },
};

export default BaseValidator;
