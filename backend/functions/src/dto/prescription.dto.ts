import { IsIn, Length, Max, Min } from "class-validator";
import {
  CaseAction as CA,
  PrescriptionAction as PA,
  Unit,
  UNITS,
  Validation as V,
} from "../constants";

export class PrescriptionDto {
  @Length(1, 66, {
    message: V.NOT_WITHIN_RANGE,
    groups: [CA.CREATE, PA.CREATE],
  })
  public doctorId: string;

  @Length(1, 1024, {
    message: V.NOT_WITHIN_RANGE,
    groups: [CA.CREATE, PA.CREATE],
  })
  public drug: string;

  @Min(1, {
    message: V.LESS_THAN_MIN_NUMBER,
    groups: [CA.CREATE, PA.CREATE],
  })
  @Max(4096, {
    message: V.LARGER_THAN_MAX_NUMBER,
    groups: [CA.CREATE, PA.CREATE],
  })
  public quantity: number;

  @IsIn(UNITS, {
    message: V.INVALID_VALUE,
    groups: [CA.CREATE, PA.CREATE],
  })
  public unit: Unit;

  @Length(1, 4096, {
    message: V.NOT_WITHIN_RANGE,
    groups: [CA.CREATE, PA.CREATE],
  })
  public frequency: string;

  @Length(1, 4096, {
    message: V.NOT_WITHIN_RANGE,
    groups: [CA.CREATE, PA.CREATE],
  })
  public route: string;

  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE] })
  public caseId: string;
}
