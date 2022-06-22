export class LikeResponse {
  constructor(_id: string, likes: Array<string>) {
    this._id = _id;
    this.likes = likes;
  }

  _id: string;

  likes: Array<string>;
}
