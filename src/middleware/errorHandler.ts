import { Request, Response, NextFunction } from 'express';
import httpStatusCode from '../responses/statusCodes.response';
import { logger } from '../helpers/logging';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (res.headersSent) {
    return next(err);
  }
  let response = {
    code: err.code || httpStatusCode.INTERNAL_SERVER,
    message: err.message || httpStatusCode.INTERNAL_SERVER,
    stack: err.stack,
  };

  if (err.name === 'ValidationError') {
    const errors = [];
    if (err.details && err.details.body) {
      err.details.body.forEach(element => {
        errors.push(element.message);
      });
    }

    response = {
      code: err.statusCode,
      message: err.error,
      stack: errors,
    };
  }

  logger.error(err);
  // return req
  //   .status(response.code || httpStatusCode.INTERNAL_SERVER)
  //   .json(response)
  //   .end();
}
export default errorHandler;
