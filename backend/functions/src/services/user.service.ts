import { Service } from "typedi";
import { UserDao } from "../dao";
import { UserDto } from "../dto";

@Service()
export class UserService {
  constructor(private readonly userDao: UserDao) {}

  public create = async (user: UserDto): Promise<string | null> =>
    this.userDao.create(user);

  public getById = async (id: string): Promise<User | null> =>
    this.userDao.getById(id);

  public getByWalletId = async (walletId: string): Promise<User | null> => {
    const users = await this.userDao.getAll([["walletId", "==", walletId]]);
    return users.length > 0 ? users[0] : null;
  };
}
