import { Service } from "typedi";
import { Abi, Account, Contract, ec, Provider } from "starknet";
import ContractAbi from "../abis/contract.json";
import { Role } from "../constants";

@Service()
export class ContractService {
  private contract: Contract;

  constructor() {
    const library = new Provider({
      network: (process.env.STARKNET_NETWORK as NetworkName) || "goerli-alpha",
    });

    const account = new Account(
      library,
      process.env.OWNER_ADDRESS!,
      ec.getKeyPair(process.env.OWNER_PRIVATE_KEY!)
    );

    this.contract = new Contract(
      ContractAbi as Abi,
      process.env.STARKNET_CONTRACT_ADDRESS!,
      account
    );
  }

  public register = async (
    role: Omit<Role, "ADMIN" | "MODERATOR">,
    args: any[]
  ): Promise<any> => {
    return this.contract.invoke(`register_${role.toLowerCase()}`, args, {
      maxFee: Number.MAX_SAFE_INTEGER,
    });
  };
}
