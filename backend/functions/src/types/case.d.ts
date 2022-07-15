import { Role } from "../constants";

declare global {
  type Case = {
    id?: string;
    doctorId: string;
    prescriptions: Prescription[];
  };
}
