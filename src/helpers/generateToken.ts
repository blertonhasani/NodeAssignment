import * as jwt from 'jsonwebtoken';
import UserForToken from '../dto/userForToken';
import JWTConfigs from '../configs/jwt';

const jwtPayload = (user: UserForToken) => ({
  id: user.id,
});

export default function generateToken(user: UserForToken): Promise<string> {
  const payload = jwtPayload(user);

  return jwt.sign(payload, JWTConfigs.secretToken, {
    expiresIn: JWTConfigs.expiresIn,
  });
}
