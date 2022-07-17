import { IsArray, Length } from "class-validator";
import { Signature } from "starknet";
import { DrugAdminLogAction as DALA, Validation as V } from "../constants";

export class DrugAdminLogTxDto {
  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE_TX] })
  public id: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE_TX] })
  public prescriptionId: string;

  @IsArray({ groups: [DALA.CREATE_TX] })
  public signature: Signature;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE_TX] })
  public hash1: string;

  @Length(1, 4096, { message: V.NOT_WITHIN_RANGE, groups: [DALA.CREATE_TX] })
  public hash2: string;
}
