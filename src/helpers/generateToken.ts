import UserForToken from '../dto/userForToken';

const jwt = require('jsonwebtoken');
const JWTConfigs = require('../configs/jwt');

const jwtPayload = (user: UserForToken) => ({
  id: user.id,
});

export default function generateToken(user: UserForToken): Promise<string> {
  const payload = jwtPayload(user);

  return jwt.sign(payload, JWTConfigs.secretToken, {
    expiresIn: JWTConfigs.expiresIn,
  });
}
