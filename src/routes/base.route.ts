import { Router } from 'express';
import { validate } from 'express-validation';
import BaseController from '../controllers/base.controller';
import authenticateToken from '../middleware/auth';
import BaseValidator from '../validators/base.validator';

const baseRouter = Router();

baseRouter.route('/signup').post(validate(BaseValidator.signup), BaseController.signup);
baseRouter.route('/login').post(validate(BaseValidator.login), BaseController.login);
baseRouter.route('/me').get(authenticateToken, BaseController.me);
baseRouter.route('/me/update-password').put(authenticateToken, validate(BaseValidator.updatePassword), BaseController.updatePassword);
baseRouter.route('/most-liked').get(BaseController.mostLiked);

export default baseRouter;
