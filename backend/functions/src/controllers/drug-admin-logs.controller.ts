import { Body, Get, Param, Post, UseBefore } from "routing-controllers";
import { DrugAdminLogDto, DrugAdminLogTxDto } from "../dto";
import { DrugAdminLogService } from "../services";
import { Controller } from "../decorators";
import { DrugAdminLogAction as DALA, Role } from "../constants";
import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/drug-admin-logs")
@UseBefore(IsAuthenticated)
export class DrugAdminLogController {
  constructor(private readonly drugAdminLogService: DrugAdminLogService) {}

  /**
   * Create drug administration log
   * @param drugAdminLog
   * @returns
   */
  @Post()
  @UseBefore(IsAuthorized(Role.ADMIN, Role.DOCTOR, Role.NURSE))
  public async create(
    @Body({ validate: { groups: [DALA.CREATE] } })
        drugAdminLog: DrugAdminLogDto
  ): ApiResponse {
    const id = await this.drugAdminLogService.create(drugAdminLog);

    return { success: !!id, data: { id } };
  }

  @Get("/:id")
  @UseBefore(IsAuthorized(Role.ADMIN, Role.DOCTOR, Role.NURSE))
  public async getById(@Param("id") id: string): ApiResponse {
    const data = await this.drugAdminLogService.getById(id);

    return { success: !!data, data };
  }

  @Post("/tx")
  @UseBefore(IsAuthorized(Role.ADMIN, Role.DOCTOR, Role.NURSE))
  public async createTx(
    @Body({ validate: { groups: [DALA.CREATE_TX] } })
        drugAdminLogTxDto: DrugAdminLogTxDto
  ): ApiResponse {
    const data = await this.drugAdminLogService.createTx(drugAdminLogTxDto);

    return { success: !!data, data };
  }
}
