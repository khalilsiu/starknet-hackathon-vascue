import { Body, Get, Param, Post, UseBefore } from "routing-controllers";
import { PrescriptionDto } from "../dto";
import { PrescriptionService } from "../services";
import { Controller } from "../decorators";
import { PrescriptionAction as PA, Role } from "../constants";
import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/prescriptions")
@UseBefore(IsAuthenticated)
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  /**
   * DEPRECATED - Prescription should not be created without case
   * @param Prescription
   * @returns
   */
  @Post()
  @UseBefore(IsAuthorized(Role.DOCTOR))
  public async create(
    @Body({ validate: { groups: [PA.CREATE] } })
    Prescription: PrescriptionDto
  ): ApiResponse {
    const id = await this.prescriptionService.create(Prescription);

    return { success: !!id, data: { id } };
  }

  @Get("/:id")
  @UseBefore(IsAuthorized(Role.DOCTOR, Role.NURSE))
  public async getById(@Param("id") id: string): ApiResponse {
    const data = await this.prescriptionService.getById(id);

    return { success: !!data, data };
  }
}
