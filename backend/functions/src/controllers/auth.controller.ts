import { Body, OnNull, Post } from "routing-controllers";
import { sign } from "jsonwebtoken";
import { UserDto } from "../dto";
import { UserService } from "../services";
import { Controller } from "../decorators";
import { User as U } from "../constants";
import { InvalidCredentialError } from "../http-errors";

@Controller("/auth")
export class AuthController {
  constructor(private readonly userService: UserService) {}

  /**
   * Login - A simple login by checking wallet id only w/o challenge
   * @param user -> walletId
   * @returns
   */
  @Post("/login")
  @OnNull(InvalidCredentialError)
  public async login(
    @Body({ validate: { groups: [U.LOGIN] } }) user: UserDto
  ): ApiResponse {
    const existingUser = await this.userService.getByWalletId(user.walletId);

    if (!existingUser) {
      return null;
    }

    const accessToken = sign(existingUser, process.env.JWT_SECRET!);
    return {
      success: !!existingUser,
      data: { accessToken, user: existingUser },
    };
  }
}
