import { Body, Post, UseBefore } from "routing-controllers";
import { CaseDto } from "../dto";
import { CaseService } from "../services";
import { Controller } from "../decorators";
import { CaseAction as CA, Role } from "../constants";
import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/cases")
@UseBefore(IsAuthenticated, IsAuthorized(Role.ADMIN, Role.DOCTOR))
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post()
  public async create(
    @Body({ validate: { groups: [CA.CREATE] } })
    caseDto: CaseDto
  ): ApiResponse {
    const id = await this.caseService.create(caseDto);

    return { success: !!id, data: { id } };
  }
}
