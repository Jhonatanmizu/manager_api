import { registerAs } from '@nestjs/config';

export default registerAs('jwtConfig', () => {
  return {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: Number(process.env.JWT_EXPIRES_IN) || 3600,
    JWT_TOKEN_AUDIENCE: process.env.JWT_TOKEN_AUDIENCE,
    JWT_TOKEN_ISSUER: process.env.JWT_TOKEN_ISSUER,
    JWT_REFRESH_EXPIRES_IN: Number(process.env.JWT_REFRESH_EXPIRES_IN) || 86400,
  };
});
