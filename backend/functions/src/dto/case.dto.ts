import { Length } from "class-validator";
import { Case as C, Validation as V } from "../constants";
import { PrescriptionDto } from "./prescription.dto";

export class CaseDto {
  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [C.CREATE] })
  public doctorId: string;

  public prescriptions: PrescriptionDto[];
}
