import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import { Role, ErrorCode as EC } from "../constants";

export const IsAuthorized = (...roles: Role[]) =>
  function use(req: Request, res: Response, next: NextFunction) {
    roles.includes(req.auth?.role) ?
      next() :
      res
          .status(401)
          .json({ success: false, data: { message: EC.UNAUTHORIZED } });
  };
