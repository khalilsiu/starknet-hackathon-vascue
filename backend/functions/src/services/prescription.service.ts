import { Service } from "typedi";
import { PrescriptionDao } from "../dao";
import { PrescriptionDto } from "../dto";

@Service()
export class PrescriptionService {
  constructor(private readonly prescriptionDao: PrescriptionDao) {}

  public create = async (
    prescription: PrescriptionDto
  ): Promise<string | null> => this.prescriptionDao.create(prescription);

  public getById = async (id: string): Promise<Prescription | null> =>
    this.prescriptionDao.getById(id);

  public getByDoctorId = async (doctorId: string): Promise<Prescription[]> =>
    this.prescriptionDao.getAll([["doctorId", "==", doctorId]]);

  public getByCaseId = async (caseId: string): Promise<Prescription[]> =>
    this.prescriptionDao.getAll([["caseId", "==", caseId]]);
}
