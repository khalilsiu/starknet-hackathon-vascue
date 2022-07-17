import { Service } from "typedi";
import { DrugAdminLogDao } from "../dao";
import { DrugAdminLogDto } from "../dto";

@Service()
export class DrugAdminLogService {
  constructor(private readonly drugAdminLogDao: DrugAdminLogDao) {}

  public create = async (
    drugAdminLog: DrugAdminLogDto
  ): Promise<string | null> => this.drugAdminLogDao.create(drugAdminLog);

  public getById = async (id: string): Promise<DrugAdminLog | null> =>
    this.drugAdminLogDao.getById(id);

  public getByCaseId = async (caseId: string): Promise<DrugAdminLog[]> =>
    this.drugAdminLogDao.getAll([["caseId", "==", caseId]]);
}
