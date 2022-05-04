const Express = require('express');

const CreateUser = require('../dto/createUser');

const ChangePassword = require('../dto/changePassword');

const UserService = require('../services/user.service');

type UserTypes = {
  username: string;
  password: string;
};

export default class BaseController {
  public static async signup(req: any, res: any, next: any): Promise<void> {
    try {
      const userModel = new CreateUser(req.body);
      const result = await UserService.signup(userModel);
      res.status(result.statusCode).send(result);
    } catch (error) {
      res.error;
    }
  }

  public static async updatePassword(req: any, res: any, next: any): Promise<void> {
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

  public static async login(req: any, res: any, next: any): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await UserService.login(username, password);
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async mostLiked(req: any, res: any, next: any): Promise<void> {
    try {
      const result = await UserService.mostLiked();
      res.status(result.statusCode).send(result);
    } catch (error) {
      next(error);
    }
  }

  public static async me(req: any, res: any, next: any): Promise<void> {
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
