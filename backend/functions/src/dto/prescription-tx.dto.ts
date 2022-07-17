import { IsArray, Length } from "class-validator";
import { Signature } from "starknet";
import { PrescriptionAction as PA, Validation as V } from "../constants";

export class PrescriptionTxDto {
  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE_TX] })
  public id: string;

  @IsArray({ groups: [PA.CREATE_TX] })
  public signature: Signature;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE_TX] })
  public hash1: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [PA.CREATE_TX] })
  public hash2: string;
}
