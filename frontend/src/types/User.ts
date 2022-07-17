export enum Role {
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
}

export type User = {
  id?: string;
  name: string;
  walletId: string;
  role: Role;
};