/* eslint-disable consistent-return */
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import httpStatusCode from '../responses/statusCodes.response';
import JWTConfigs from '../configs/jwt';
import { BaseResponse, ErrorResponse } from '../responses/base.response';
import responseMessages from '../responses/message.response';

export default function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer') && authHeader.split(' ')[1];

  if (token == null) {

    return res
      .status(httpStatusCode.UNAUTHORIZED)
      .send(new BaseResponse({ statusCode: httpStatusCode.UNAUTHORIZED, error: new ErrorResponse(responseMessages.UNAUTHORIZED) }))
      .end();
  }

  jwt.verify(token, JWTConfigs.secretToken, (err, user) => {
    if (err) {
      res.status(httpStatusCode.UNAUTHORIZED).send(err);
      return;
    }


    req.token = token;
    req.userId = user.id;
    next();
  });
}
