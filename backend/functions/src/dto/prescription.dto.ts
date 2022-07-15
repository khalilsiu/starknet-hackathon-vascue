import { Length } from "class-validator";
import { Prescription as P, Unit, Validation as V } from "../constants";

export class PrescriptionDto {
  @Length(1, 66, { message: V.NOT_WITHIN_RANGE, groups: [P.CREATE] })
  public doctorId: string;

  public drug: string;

  public quantity: number;

  public unit: Unit;

  public frequency: string;

  public route: string;

  public caseId: string;
}
