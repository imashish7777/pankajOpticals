const requiredEnv = (name) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const jwtSecret = () => requiredEnv("JWT_SECRET");

const clientUrl = () => process.env.CLIENT_URL || "http://localhost:3000";

const adminUrl = () => process.env.ADMIN_URL || "http://localhost:3001";

module.exports = { requiredEnv, jwtSecret, clientUrl, adminUrl };
