import { Joi } from 'express-validation';

const ObjectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const UserValidator = {
  like: {
    params: Joi.object({
      id: ObjectId.required(),
    }),
  },
  unlike: {
    params: Joi.object({
      id: ObjectId.required(),
    }),
  },
  getById: {
    params: Joi.object({
      id: ObjectId.required(),
    }),
  },
};
export default UserValidator;
