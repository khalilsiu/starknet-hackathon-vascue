import { Role } from "../constants";

declare global {
  type User = {
    name: string;
    walletId: string;
    role: Role;
  };
}
