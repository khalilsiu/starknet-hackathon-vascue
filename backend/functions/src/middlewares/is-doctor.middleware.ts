import { NextFunction, Response } from "express";
import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { Request } from "express-jwt";
import { ActionError as AE, Role as R } from "../constants";

@Middleware({ type: "before" })
@Service()
export class IsDoctorMiddleware implements ExpressMiddlewareInterface {
  public async use(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    if ([R.DOCTOR, R.ADMIN].includes(req.auth?.role)) {
      next();

      return;
    }

    res
      .status(404)
      .json({ success: false, message: AE.ONLY_DOCTOR_CAN_PERFORM });
  }
}
