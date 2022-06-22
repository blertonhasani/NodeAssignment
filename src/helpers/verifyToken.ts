import * as jwt from 'jsonwebtoken';

export default function verifyToken(token: string): boolean {
  return jwt.verify(token, process.env.JWT_SECRET);
}
