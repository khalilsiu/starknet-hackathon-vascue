import { HttpError } from "routing-controllers";
import { ErrorCode as EC } from "../constants";

export class InvalidCredentialError extends HttpError {
  constructor() {
    super(404, EC.INVALID_CREDENTIAL);
  }
}
