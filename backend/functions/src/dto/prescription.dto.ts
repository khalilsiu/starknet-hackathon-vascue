import { IsIn, Length } from "class-validator";
import { CaseAction as CA, Unit, UNITS, Validation as V } from "../constants";

export class PrescriptionDto {
  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [CA.CREATE] })
  public doctorId: string;

  @Length(1, 1024, { message: V.NOT_WITHIN_RANGE, groups: [CA.CREATE] })
  public drug: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [CA.CREATE] })
  public quantity: number;

  @IsIn(UNITS, {
    message: V.INVALID_VALUE,
    groups: [CA.CREATE],
  })
  public unit: Unit;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [CA.CREATE] })
  public frequency: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [CA.CREATE] })
  public route: string;

  public caseId: string;
}
