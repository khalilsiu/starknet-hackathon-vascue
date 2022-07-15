import { Body, Get, Param, Post, UseBefore } from "routing-controllers";
import { UserDto } from "../dto";
import { CaseService, UserService } from "../services";
import { Controller } from "../decorators";
import { User as U } from "../constants";
import { IsAuthenticated, IsDoctorMiddleware } from "../middlewares";

@Controller("/users")
@UseBefore(IsAuthenticated)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly caseService: CaseService
  ) {}

  /**
   * Create User - Doctor, Nurse, Moderator
   * @param user
   * @returns
   */
  @Post()
  public async create(
    @Body({ validate: { groups: [U.CREATE] } }) user: UserDto
  ): ApiResponse {
    const id = await this.userService.create(user);

    return { success: !!id, data: { id } };
  }

  /**
   * Get cases created by the doctor
   * @returns
   */
  @Get("/:id/cases")
  @UseBefore(IsDoctorMiddleware)
  public async getDoctorCases(@Param("id") id: string): ApiResponse {
    const data = await this.caseService.getByDoctorId(id);

    return { success: !!id, data };
  }
}
