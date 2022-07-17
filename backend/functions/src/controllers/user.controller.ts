import { Body, Post } from "routing-controllers";
import { UserDto } from "../dto";
import { UserService } from "../services";
import { Controller } from "../decorators";
import { User as U } from "../constants";
// import { IsAuthenticated, IsAuthorized } from "../middlewares";

@Controller("/users")
// Allow anyone to register
// @UseBefore(IsAuthenticated, IsAuthorized(Role.ADMIN))
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
    const data = await this.userService.create(user);

    return { success: !!data, data };
  }
}
