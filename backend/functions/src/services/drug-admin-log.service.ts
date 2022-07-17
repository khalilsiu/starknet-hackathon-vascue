import { Service } from "typedi";
import { DrugAdminLogDao } from "../dao";
import { DrugAdminLogDto, DrugAdminLogTxDto } from "../dto";
import { ContractService } from "./contract.service";

@Service()
export class DrugAdminLogService {
  constructor(
    private readonly drugAdminLogDao: DrugAdminLogDao,
    private readonly contractService: ContractService
  ) {}

  public create = async (
      drugAdminLog: DrugAdminLogDto
  ): Promise<string | null> => this.drugAdminLogDao.create(drugAdminLog);

  public createTx = async (drugAdminLogTxDto: DrugAdminLogTxDto) => {
    const { signature, id, prescriptionId, hash1, hash2 } = drugAdminLogTxDto;
    return this.contractService.attestLog(
        "drug_administration",
        [id, prescriptionId, hash1, hash2],
        signature
    );
  };

  public getById = async (id: string): Promise<DrugAdminLog | null> =>
    this.drugAdminLogDao.getById(id);

  public getByCaseId = async (caseId: string): Promise<DrugAdminLog[]> =>
    this.drugAdminLogDao.getAll([["caseId", "==", caseId]]);
}
