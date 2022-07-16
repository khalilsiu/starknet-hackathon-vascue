import { IsIn, Length } from "class-validator";
import {
  PrescriptionAction as PA,
  Unit,
  UNITS,
  Validation as V,
} from "../constants";

export class PrescriptionDto {
  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE] })
  public doctorId: string;

  @Length(1, 1024, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE] })
  public drug: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE] })
  public quantity: number;

  @IsIn(UNITS, {
    message: V.INVALID_VALUE,
    groups: [PA.CREATE],
  })
  public unit: Unit;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE] })
  public frequency: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE] })
  public route: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE] })
  public caseId: string;
}
