import { IsIn, Length } from "class-validator";
import {
  DrugAdminLogAction as DALA,
  Unit,
  UNITS,
  Validation as V,
} from "../constants";

export class DrugAdminLogDto {
  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE] })
  public prescriptionId: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE] })
  public caseId: string;

  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE] })
  public nurseId: string;

  @Length(1, 1024, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE] })
  public drug: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE] })
  public quantity: number;

  @IsIn(UNITS, {
    message: V.INVALID_VALUE,
    groups: [DALA.CREATE],
  })
  public unit: Unit;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE] })
  public route: string;
}
