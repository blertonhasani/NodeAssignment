import { Router } from 'express';
import { validate } from 'express-validation';
import UserController from '../controllers/user.controller';
import authenticateToken from '../middleware/auth';
import UserValidator from '../validators/user.validator';

const userRouter: Router = Router();

userRouter.route('/:id/').get(validate(UserValidator.getById), UserController.userInfo);
userRouter.route('/:id/like').put(authenticateToken, validate(UserValidator.like), UserController.like);
userRouter.route('/:id/unlike').put(authenticateToken, validate(UserValidator.unlike), UserController.unLike);

export default userRouter;
