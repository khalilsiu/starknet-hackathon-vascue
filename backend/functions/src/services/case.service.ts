import { Service } from "typedi";
import { CaseDao } from "../dao";
import { CaseDto } from "../dto";
import { PrescriptionService } from ".";

@Service()
export class CaseService {
  constructor(
    private readonly caseDao: CaseDao,
    private readonly prescriptionService: PrescriptionService
  ) {}

  public create = async (caseDto: CaseDto): Promise<string | null> => {
    const { prescriptions, ...caseData } = caseDto;
    const caseId = await this.caseDao.create(caseData);

    if (!caseId) {
      return null;
    }

    // TODO: use batch to write
    const prescriptionPromises = prescriptions.map(async (prescription) => {
      await this.prescriptionService.create({ ...prescription, caseId });
    });

    await Promise.allSettled(prescriptionPromises);

    return caseId;
  };

  public getById = async (id: string): Promise<Case | null> =>
    this.caseDao.getById(id);

  public getByDoctorId = async (doctorId: string): Promise<Case | null> => {
    const cases = await this.caseDao.getAll([["doctorId", "==", doctorId]]);

    if (cases.length === 1) {
      const prescriptions = await this.prescriptionService.getByCaseId(
        cases[0].id!
      );

      return { ...cases[0], prescriptions };
    }

    return null;
  };
}
