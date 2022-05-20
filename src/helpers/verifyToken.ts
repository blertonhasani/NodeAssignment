import * as jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function verifyToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET);
}
