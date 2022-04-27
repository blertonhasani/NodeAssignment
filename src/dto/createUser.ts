interface ICreateUser {
  username: string;
  password: string;
}

class CreateUser {
  username: string;

  password: string;

  constructor(obj: ICreateUser) {
    this.username = obj.username;
    this.password = obj.password;
  }
}

export default CreateUser;
