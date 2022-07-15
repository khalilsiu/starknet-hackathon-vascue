import { Body, Post } from "routing-controllers";
import { sign } from "jsonwebtoken";
import { UserDto } from "../dto";
import { UserService } from "../services";
import { Controller } from "../decorators";
import { User as U } from "../constants";

@Controller("/auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  /**
   * Login
   * @param user -> walletId
   * @returns
   */
  @Post("/login")
  public async login(
    @Body({ validate: { groups: [U.LOGIN] } }) user: UserDto
  ): ApiResponse {
    const existingUser = await this.userService.getByWalletId(user.walletId);

    if (existingUser) {
      const accessToken = sign(existingUser, process.env.JWT_SECRET!);
      return { success: !!existingUser, data: { accessToken } };
    }

    return { success: !!existingUser, data: {} };
  }
}
