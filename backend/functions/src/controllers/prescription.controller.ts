import { Body, Post, UseBefore } from "routing-controllers";
import { PrescriptionDto } from "../dto";
import { PrescriptionService } from "../services";
import { Controller } from "../decorators";
import { PrescriptionAction as PA, Role } from "../constants";
import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/prescriptions")
@UseBefore(IsAuthenticated, IsAuthorized(Role.DOCTOR))
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  /**
   * DEPRECATED - Prescription should not be created without case
   * @param Prescription
   * @returns
   */
  @Post()
  public async create(
    @Body({ validate: { groups: [PA.CREATE] } })
    Prescription: PrescriptionDto
  ): ApiResponse {
    const id = await this.prescriptionService.create(Prescription);

    return { success: !!id, data: { id } };
  }
}
