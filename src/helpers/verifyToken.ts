const jwt = require('jsonwebtoken');

export default function verifyToken(token: string): any {
  return jwt.verify(token, process.env.JWT_SECRET);
}
