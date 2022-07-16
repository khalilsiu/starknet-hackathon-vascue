import { Type } from "class-transformer";
import { Length, ValidateNested } from "class-validator";
import { CaseAction as CA, Validation as V } from "../constants";
import { PrescriptionDto } from "./prescription.dto";

export class CaseDto {
  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [CA.CREATE] })
  public doctorId: string;

  @ValidateNested({ each: true, groups: [CA.CREATE] })
  @Type(() => PrescriptionDto)
  public prescriptions: PrescriptionDto[];
}
