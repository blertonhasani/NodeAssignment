export interface IMostLiked {
  username: string;
  likes: Array<string>;
}

export class MostLikedResponse {
  constructor(result: Array<IMostLiked>) {
    this.result = result;
  }

  result: Array<IMostLiked>;
}
