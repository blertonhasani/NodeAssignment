export class GetMeResponse {
  constructor(_id: string, username?: string, likes?: Array<string>) {
    this._id = _id;
    this.username = username;
    this.likes = likes;
  }

  _id: string;

  username: string;

  likes: Array<string>;
}
