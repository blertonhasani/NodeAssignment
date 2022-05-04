import { Request, Response, NextFunction, Router } from 'express';
import { BaseResponse, ErrorResponse } from '../responses/base.response';
import httpStatusCode from '../responses/statusCodes.response';
import { logger } from '../helpers/logging';
import responseMessages from '../responses/message.response';

const errorRouter = Router();

const pathNotFound = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  logger.error('Url path not found');
  res
    .status(httpStatusCode.NOT_FOUND)
    .json(new BaseResponse({ statusCode: httpStatusCode.NOT_FOUND, error: new ErrorResponse(responseMessages.PATH_NOT_FOUND) }));
  next();
};

errorRouter.use(pathNotFound);
export default errorRouter;
