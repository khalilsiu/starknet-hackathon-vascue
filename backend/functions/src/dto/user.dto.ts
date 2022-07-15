import { IsIn, Length } from "class-validator";
import { Role, ROLES, User as U, Validation as V } from "../constants";

export class UserDto {
  @Length(1, 255, { message: V.NOT_WITHIN_RANGE, groups: [U.CREATE] })
  public name: string;

  @IsIn(ROLES, {
    message: V.INVALID_VALUE,
    groups: [U.CREATE],
  })
  public role: Role;

  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [U.CREATE, U.LOGIN] })
  public walletId: string;
}
