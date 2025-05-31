import dotenv from "dotenv";
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY!;
if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets must be defined in the environment variables.");
}

if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error("ACCESS_TOKEN_SECRET must be defined");
}
if (!process.env.ACCESS_TOKEN_EXPIRY) {
  throw new Error("ACCESS_TOKEN_EXPIRY must be defined");
}

export { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET }