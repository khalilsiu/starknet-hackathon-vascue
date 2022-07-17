import { Service } from "typedi";
import { PrescriptionDao } from "../dao";
import { PrescriptionDto, PrescriptionTxDto } from "../dto";
import { ContractService } from "./contract.service";

@Service()
export class PrescriptionService {
  constructor(
    private readonly prescriptionDao: PrescriptionDao,
    private readonly contractService: ContractService
  ) {}

  public create = async (
      prescription: PrescriptionDto
  ): Promise<string | null> => this.prescriptionDao.create(prescription);

  public createTx = async (prescriptionTx: PrescriptionTxDto) => {
    const { signature, id, hash1, hash2 } = prescriptionTx;
    return this.contractService.attestLog(
        "prescription",
        [id, hash1, hash2],
        signature
    );
  };

  public getById = async (id: string): Promise<Prescription | null> =>
    this.prescriptionDao.getById(id);

  public getByDoctorId = async (doctorId: string): Promise<Prescription[]> =>
    this.prescriptionDao.getAll([["doctorId", "==", doctorId]]);

  public getByCaseId = async (caseId: string): Promise<Prescription[]> =>
    this.prescriptionDao.getAll([["caseId", "==", caseId]]);
}
