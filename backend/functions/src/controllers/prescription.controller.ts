import { Body, Get, Param, Post, UseBefore } from "routing-controllers";
import { PrescriptionDto, PrescriptionTxDto } from "../dto";
import { PrescriptionService } from "../services";
import { Controller } from "../decorators";
import { PrescriptionAction as PA, Role } from "../constants";
import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/prescriptions")
@UseBefore(IsAuthenticated)
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  /**
   * Create Prescription
   * @param Prescription
   * @returns
   */
  @Post()
  // @UseBefore(IsAuthorized(Role.DOCTOR))
  public async create(
    @Body({ validate: { groups: [PA.CREATE] } })
        prescription: PrescriptionDto
  ): ApiResponse {
    const id = await this.prescriptionService.create(prescription);

    return { success: !!id, data: { id } };
  }

  @Get("/:id")
  @UseBefore(IsAuthorized(Role.DOCTOR, Role.NURSE))
  public async getById(@Param("id") id: string): ApiResponse {
    const data = await this.prescriptionService.getById(id);

    return { success: !!data, data };
  }

  @Post("/tx")
  @UseBefore(IsAuthorized(Role.DOCTOR, Role.NURSE))
  public async createTx(
    @Body({ validate: { groups: [PA.CREATE_TX] } })
        prescriptionTx: PrescriptionTxDto
  ): ApiResponse {
    const data = await this.prescriptionService.createTx(prescriptionTx);

    return { success: !!data, data };
  }
}
