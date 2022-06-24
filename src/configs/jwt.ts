const secretToken = process.env.JWT_SECRET;

const JWTConfigs = {
  secretToken,
  expiresIn: '7h',
};

export default JWTConfigs;
