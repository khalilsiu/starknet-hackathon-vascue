import { Body, Post, UseBefore } from "routing-controllers";
import { PrescriptionDto } from "../dto";
import { PrescriptionService } from "../services";
import { Controller } from "../decorators";
import { Prescription as P } from "../constants";
import { IsAuthenticated, IsDoctorMiddleware } from "../middlewares";

@Controller("/prescriptions")
@UseBefore(IsAuthenticated, IsDoctorMiddleware)
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  /**
   * DEPRECATED - Prescription should not be created without case
   * @param Prescription
   * @returns
   */
  @Post()
  public async create(
    @Body({ validate: { groups: [P.CREATE] } })
    Prescription: PrescriptionDto
  ): ApiResponse {
    const id = await this.prescriptionService.create(Prescription);

    return { success: !!id, data: { id } };
  }
}
