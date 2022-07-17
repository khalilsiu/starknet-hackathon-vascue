import { Unit } from "../constants";

declare global {
  type DrugAdminLog = {
    id?: string;
    prescriptionId: string;
    caseId: string;
    nurseId: string;
    drug: string;
    quantity: number;
    unit: Unit;
    route: string;
  };
}
