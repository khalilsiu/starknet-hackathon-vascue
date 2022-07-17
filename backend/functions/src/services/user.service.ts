import { Service } from "typedi";
import { ErrorCode as EC } from "../constants";
import { UserDao } from "../dao";
import { UserDto } from "../dto";
import { ContractService } from "./contract.service";

@Service()
export class UserService {
  constructor(
    private readonly userDao: UserDao,
    private readonly contractService: ContractService
  ) {}

  public create = async (
      user: UserDto
  ): Promise<Record<string, string> | null> => {
    if (await this.userDao.isDuplicated(user.walletId)) {
      throw new Error(EC.DUPLICATE_DATA);
    }

    const id = await this.userDao.create(user);
    if (!id) {
      return null;
    }

    const response = await this.contractService.register(user.role, [
      id,
      user.walletId,
    ]);

    return { id, transactionHash: response.transaction_hash };
  };

  public getById = async (id: string): Promise<User | null> =>
    this.userDao.getById(id);

  public getByWalletId = async (walletId: string): Promise<User | null> => {
    const users = await this.userDao.getAll([["walletId", "==", walletId]]);
    return users.length > 0 ? users[0] : null;
  };
}
