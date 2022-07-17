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

  public getById = async (id: string): Promise<Case | null> => {
    const medicalCase = await this.caseDao.getById(id);

    if (!medicalCase) {
      return null;
    }

    const prescriptions = await this.prescriptionService.getByCaseId(id);
    return { ...medicalCase, prescriptions };
  };

  public getByDoctorId = async (doctorId: string): Promise<Case[] | null> => {
    const cases = await this.caseDao.getAll(
        [["doctorId", "==", doctorId]],
        "createdAt",
        "desc"
    );

    const allCases = cases.reduce(async (records, medicalCase) => {
      const prescriptions = await this.prescriptionService.getByCaseId(
        medicalCase.id!
      );

      return (await records).concat({ ...medicalCase, prescriptions });
    }, Promise.resolve([] as Case[]));

    return Promise.all(await allCases);
  };
}
