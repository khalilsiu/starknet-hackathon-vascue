import { DocumentData, Query, WhereFilterOp } from "@google-cloud/firestore";
import { Service } from "typedi";
import { db } from "../firestore";
import { DrugAdminLogDto } from "../dto";
import { generateId } from "../utils";

@Service()
export class DrugAdminLogDao {
  private static COLLECTION_NAME = "drugAdminLogs";

  public create = async (
      drugAdminLog: DrugAdminLogDto
  ): Promise<string | null> => {
    const dataCount = (
      await db.collection(`${DrugAdminLogDao.COLLECTION_NAME}`).get()
    ).size;
    const miniId = generateId(dataCount).toString();

    const drugAdminLogRef = db
        .collection(DrugAdminLogDao.COLLECTION_NAME)
        .doc(miniId);
    const request = await drugAdminLogRef.set({
      ...drugAdminLog,
      createdAt: Date.now(),
    });

    return request?.writeTime ? miniId : null;
  };

  public getById = async (id: string): Promise<DrugAdminLog | null> => {
    const doc = await db
        .collection(DrugAdminLogDao.COLLECTION_NAME)
        .doc(id)
        .get();

    return doc.exists && doc.data() ? (doc.data() as DrugAdminLog) : null;
  };

  public getAll = async (
      conditions: [keyof DrugAdminLog, WhereFilterOp, string | number][] = [],
      orderBy?: string,
      orderDirection?: "asc" | "desc"
  ): Promise<DrugAdminLog[]> => {
    const drugAdminLogRef = db.collection(`${DrugAdminLogDao.COLLECTION_NAME}`);

    const drugAdminLogQuery = conditions.reduce(
        (acc: Query<DocumentData>, condition) =>
          acc.where(condition[0] as string, condition[1], condition[2]),
        drugAdminLogRef
    );

    const drugAdminLogSnapshot = await drugAdminLogQuery
        .orderBy(orderBy || "createdAt", orderDirection || "asc")
        .get();

    if (drugAdminLogSnapshot.empty) {
      return [];
    }

    const drugAdminLogs: DrugAdminLog[] = [];

    drugAdminLogSnapshot.docs.forEach((doc) => {
      drugAdminLogs.push({ id: doc.id, ...doc.data() } as DrugAdminLog);
    });

    return drugAdminLogs;
  };
}
