import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import CreateUser from '../dto/createUser';
import ChangePassword from '../dto/changePassword';

export default class BaseController {
  public static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userModel = new CreateUser(req.body);
      const result = await UserService.signup(userModel);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async updatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { userId } = req;
      const changePassword = new ChangePassword(req.body);
      const result = await UserService.updatePassword(userId.toString(), changePassword);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await UserService.login(username, password);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async mostLiked(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await UserService.mostLiked();
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { userId } = req;
      const result = await UserService.getMe(userId.toString());
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }
}
