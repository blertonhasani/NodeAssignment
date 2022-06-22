import * as bcrypt from 'bcryptjs';
import CreateUser from '../dto/createUser';
import ChangePassword from '../dto/changePassword';
import User from '../models/user';
import { BaseResponse, ErrorResponse } from '../responses/base.response';
import { LoginResponse } from '../responses/login.response';
import httpStatusCode from '../responses/statusCodes.response';
import responseMessages from '../responses/message.response';
import generateToken from '../helpers/generateToken';
import UserForToken from '../dto/userForToken';
import { UserInfoResponse } from '../responses/userInfo.response';
import { LikeResponse } from '../responses/like.response';
import { UnLikeResponse } from '../responses/unlike.response';
import { MostLikedResponse, IMostLiked } from '../responses/mostLiked.response';
import { GetMeResponse } from '../responses/getMe.response';

export class UserService {
  public static async signup(user: CreateUser): Promise<BaseResponse> {
    const exists = await this.checkIfExists(user.username);
    if (exists) {
      return new BaseResponse({ statusCode: httpStatusCode.CONFLICT, error: new ErrorResponse(responseMessages.USER_EXISTS) });
    }
    await User.create(user);
    return new BaseResponse({ statusCode: httpStatusCode.CREATED, message: responseMessages.SIGNUP });
  }

  public static async checkIfExists(name: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return User.exists({ username: name });
  }

  public static async login(username: string, password: string): Promise<BaseResponse> {
    const user = await User.findOne({ username });
    if (!user) {
      return new BaseResponse({ statusCode: httpStatusCode.NOT_FOUND, error: new ErrorResponse(responseMessages.USER_NOT_FOUND) });
    }

    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) {
      return new BaseResponse({ statusCode: httpStatusCode.UNAUTHORIZED, error: new ErrorResponse(responseMessages.INCORRECT_PASSWORD) });
    }

    const userForToken = new UserForToken(user._id);
    const token = await generateToken(userForToken);
    const result = new LoginResponse(user._id, token);
    return new BaseResponse({ statusCode: httpStatusCode.OK, result });
  }

  public static async updatePassword(id: string, changePasswordDto: ChangePassword): Promise<BaseResponse> {
    const user = await User.findById(id);
    if (!user) {
      return new BaseResponse({ statusCode: httpStatusCode.NOT_FOUND, error: new ErrorResponse(responseMessages.USER_NOT_FOUND) });
    }

    const correctPassword = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!correctPassword) {
      return new BaseResponse({ statusCode: httpStatusCode.BAD_REQUEST, error: new ErrorResponse(responseMessages.INCORRECT_PASSWORD) });
    }

    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      return new BaseResponse({
        statusCode: httpStatusCode.BAD_REQUEST,
        error: new ErrorResponse(responseMessages.NEW_PASSWORD_MATCH_CONFIRM_PASSWORD),
      });
    }

    user.password = changePasswordDto.newPassword;
    user.save();
    return new BaseResponse({ statusCode: httpStatusCode.OK, message: responseMessages.USER_UPDATED });
  }

  public static async findOne(_id: string): Promise<BaseResponse> {
    const user = await User.findById(_id);
    if (!user) {
      return new BaseResponse({ statusCode: httpStatusCode.NOT_FOUND, error: new ErrorResponse(responseMessages.USER_NOT_FOUND) });
    }
    const result = new UserInfoResponse(user.username, user.likes.length);
    return new BaseResponse({ statusCode: httpStatusCode.OK, result });
  }

  public static async like(userId: string, likeUserId: string): Promise<BaseResponse> {
    const user = await User.findById(likeUserId);
    if (!user) {
      return new BaseResponse({ statusCode: httpStatusCode.NOT_FOUND, error: new ErrorResponse(responseMessages.USER_NOT_FOUND) });
    }
    if (userId === likeUserId) {
      return new BaseResponse({ statusCode: httpStatusCode.BAD_REQUEST, error: new ErrorResponse(responseMessages.CAN_NOT_LIKE_YOURSELF) });
    }
    if (user.likes.includes(userId)) {
      return new BaseResponse({ statusCode: httpStatusCode.BAD_REQUEST, error: new ErrorResponse(responseMessages.LIKE_EXISTS) });
    }
    user.likes.push(userId);
    await user.save();
    const result = new LikeResponse(user._id, user.likes);
    return new BaseResponse({ statusCode: httpStatusCode.OK, result });
  }

  public static async unLike(userId: string, likedUserId: string): Promise<BaseResponse> {
    const user = await User.findById(likedUserId);
    if (!user) {
      return new BaseResponse({ statusCode: httpStatusCode.NOT_FOUND, error: new ErrorResponse(responseMessages.USER_NOT_FOUND) });
    }
    if (userId === likedUserId) {
      return new BaseResponse({ statusCode: httpStatusCode.BAD_REQUEST, error: new ErrorResponse(responseMessages.CAN_NOT_LIKE_YOURSELF) });
    }

    const index = user.likes.indexOf(userId);
    if (index === -1) {
      return new BaseResponse({ statusCode: httpStatusCode.BAD_REQUEST, error: new ErrorResponse(responseMessages.LIKE_DOES_NOT_EXISTS) });
    }
    user.likes.splice(index, 1);
    await user.save();
    const result = new UnLikeResponse(user._id, user.likes);
    return new BaseResponse({ statusCode: httpStatusCode.OK, result });
  }

  public static async mostLiked(): Promise<BaseResponse> {
    const users = await User.find({});
    const payload: Array<IMostLiked> = [];
    const result = users.sort((a, b) => b.likes.length - a.likes.length);
    result.forEach(x => {
      const obj = {
        _id: x._id,
        username: x.username,
        likes: x.likes,
      };
      payload.push(obj);
    });
    const obj = new MostLikedResponse(payload);
    return new BaseResponse({ statusCode: httpStatusCode.OK, result: obj });
  }

  public static async getMe(id: string): Promise<BaseResponse> {
    const user = await User.findById(id);
    if (!user) {
      return new BaseResponse({ statusCode: httpStatusCode.NOT_FOUND, error: new ErrorResponse(responseMessages.USER_NOT_FOUND) });
    }
    const result = new GetMeResponse(user._id, user.username, user.likes);
    return new BaseResponse({ statusCode: httpStatusCode.OK, result });
  }
}
