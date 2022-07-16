import { Body, Post, UseBefore } from "routing-controllers";
import { UserDto } from "../dto";
import { UserService } from "../services";
import { Controller } from "../decorators";
import { Role, User as U } from "../constants";
import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/users")
@UseBefore(IsAuthenticated, IsAuthorized(Role.ADMIN))
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
