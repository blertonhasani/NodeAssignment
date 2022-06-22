export class LoginResponse {
  constructor(_id: string, token: string) {
    this._id = _id;
    this.token = token;
  }

  _id: string;

  token: string;
}
