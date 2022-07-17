import { Service } from "typedi";
import {
  Abi,
  Account,
  AddTransactionResponse,
  Contract,
  ec,
  Provider,
  Signature,
} from "starknet";
import ContractAbi from "../abis/contract.json";
import { Role } from "../constants";

@Service()
export class ContractService {
  private contract: Contract;
  private provider: Provider;

  constructor() {
    this.provider = new Provider({
      network: (process.env.STARKNET_NETWORK as NetworkName) || "goerli-alpha",
    });

    const account = new Account(
        this.provider,
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
      args: unknown[]
  ): Promise<AddTransactionResponse> => {
    return this.contract.invoke(`register_${role.toLowerCase()}`, args, {
      maxFee: Number.MAX_SAFE_INTEGER,
    });
  };

  public attestLog = async (
      name: "prescription" | "drug_administration",
      args: unknown[],
      signature: Signature
  ): Promise<AddTransactionResponse> => {
    const contract = new Contract(
      ContractAbi as Abi,
      process.env.STARKNET_CONTRACT_ADDRESS!,
      this.provider
    );

    return contract.invoke(`attest_${name}_log`, args, {
      maxFee: Number.MAX_SAFE_INTEGER,
      signature,
    });
  };
}
