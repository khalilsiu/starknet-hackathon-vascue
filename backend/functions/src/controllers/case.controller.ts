import { Body, Get, Param, Post, UseBefore } from "routing-controllers";
import { CaseDto } from "../dto";
import { CaseService } from "../services";
import { Controller } from "../decorators";
import { CaseAction as CA, Role } from "../constants";
import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/cases")
@UseBefore(IsAuthenticated)
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post()
  @UseBefore(IsAuthorized(Role.ADMIN, Role.DOCTOR))
  public async create(
    @Body({ validate: { groups: [CA.CREATE] } })
        caseDto: CaseDto
  ): ApiResponse {
    const id = await this.caseService.create(caseDto);

    return { success: !!id, data: { id } };
  }

  @Get("/:id")
  @UseBefore(IsAuthorized(Role.ADMIN, Role.DOCTOR, Role.NURSE))
  public async getById(@Param("id") id: string): ApiResponse {
    const data = await this.caseService.getById(id);

    return { success: !!data, data };
  }
}
