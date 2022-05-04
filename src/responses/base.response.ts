export class ErrorResponse {
  constructor(message: string, stackTrace?: string) {
    this.message = message;
    this.stackTrace = stackTrace;
  }

  message: string;

  stackTrace?: string;
}

interface IBaseResponse {
  statusCode: number;
  error?: ErrorResponse;
  message?: string;
  result?: unknown;
}

export class BaseResponse {
  constructor(obj: IBaseResponse) {
    this.statusCode = obj.statusCode;
    this.error = obj.error;
    this.message = obj.message;
    this.result = obj.result;
  }

  statusCode: number;

  error?: ErrorResponse;

  message?: string;

  result?: unknown;
}
