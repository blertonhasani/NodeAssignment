interface IChangePassword {
  _id: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class ChangePassword {
  _id: string;

  currentPassword: string;

  newPassword: string;

  confirmPassword: string;

  constructor(obj: IChangePassword) {
    this._id = obj._id;
    this.currentPassword = obj.currentPassword;
    this.newPassword = obj.newPassword;
    this.confirmPassword = obj.confirmPassword;
  }
}

export default ChangePassword;
