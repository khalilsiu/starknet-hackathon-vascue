import { Get, Param, Req, UseBefore } from "routing-controllers";
import { Request } from "express-jwt";
import { CaseService } from "../services";
import { Controller } from "../decorators";
import { IsAuthenticated, IsAuthorized } from "../middlewares";
import { Role } from "../constants";

@Controller("/doctors")
@UseBefore(IsAuthenticated)
export class DoctorController {
  constructor(private readonly caseService: CaseService) {}

  /**
   * Get cases created by the doctor
   * @returns
   */
  @Get("/:id/cases")
  @UseBefore(IsAuthorized(Role.ADMIN))
  public async getDoctorCases(@Param("id") id: string): ApiResponse {
    const data = await this.caseService.getByDoctorId(id);

    return { success: !!data, data };
  }

  /**
   * Get cases created by the current authenticated doctor
   * @returns
   */
  @Get("/cases")
  @UseBefore(IsAuthorized(Role.DOCTOR))
  public async getAuthenticatedDoctorCases(
    @Req() request: Request
  ): ApiResponse {
    const data = await this.caseService.getByDoctorId(request.auth?.id);

    return { success: !!data, data };
  }
}
