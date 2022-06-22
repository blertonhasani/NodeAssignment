import { Schema, model, Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

interface IUser extends Document {
  username: string;
  password: string;
  likes: Array<string>;
}

const UserSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

// eslint-disable-next-line consistent-return
UserSchema.pre<IUser>('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    const hashedPassword = await bcrypt.hash(this.password, 10);

    this.password = hashedPassword;

    next();
  } catch (err) {
    next(err);
  }
});

export default model<IUser>('User', UserSchema);
