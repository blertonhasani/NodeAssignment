export class UserInfoResponse {
  constructor(username?: string, numberOfLikes?: number) {
    this.username = username;
    this.numberOfLikes = numberOfLikes;
  }

  username: string;

  numberOfLikes: number;
}
