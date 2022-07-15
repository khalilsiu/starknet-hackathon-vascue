import { Body, Post, UseBefore } from "routing-controllers";
import { CaseDto } from "../dto";
import { CaseService } from "../services";
import { Controller } from "../decorators";
import { Case as P } from "../constants";
import { IsAuthenticated, IsDoctorMiddleware } from "../middlewares";

@Controller("/cases")
@UseBefore(IsAuthenticated, IsDoctorMiddleware)
export class CaseController {
  constructor(private readonly caseService: CaseService) {}

  @Post()
  public async create(
    @Body({ validate: { groups: [P.CREATE] } })
    caseDto: CaseDto
  ): ApiResponse {
    const id = await this.caseService.create(caseDto);

    return { success: !!id, data: { id } };
  }
}
