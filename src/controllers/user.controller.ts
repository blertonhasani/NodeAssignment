import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

export default class UserController {
  public static async like(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body.userId;
      const { id } = req.params;
      const result = await UserService.like(userId.toString(), id);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async unLike(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId } = req.body.userId;
      const { id } = req.params;
      const result = await UserService.unLike(userId.toString(), id);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async userInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await UserService.findOne(req.params.id);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }
}
