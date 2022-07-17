import { Unit } from "../constants";

declare global {
  type Prescription = {
    id?: string;
    doctorId: string;
    drug: string;
    quantity: number;
    unit: Unit;
    frequency: string;
    route: string;
    caseId: string;
  };
}
