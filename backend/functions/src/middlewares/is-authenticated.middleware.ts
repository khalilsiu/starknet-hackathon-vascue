import { expressjwt } from "express-jwt";
import { Algorithm } from "jsonwebtoken";

const options = {
  secret: process.env.JWT_SECRET!,
  algorithms: ["HS256"] as Algorithm[],
};

export const IsAuthenticated = expressjwt(options);
