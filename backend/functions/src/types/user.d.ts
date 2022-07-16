import { Role } from "../constants";

declare global {
  type User = {
    id?: string;
    name: string;
    walletId: string;
    role: Role;
  };
}
