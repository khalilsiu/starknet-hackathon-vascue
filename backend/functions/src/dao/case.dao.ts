import { DocumentData, Query, WhereFilterOp } from "@google-cloud/firestore";
import { Service } from "typedi";
// import { nanoid } from "nanoid";
// import toHex from "to-hex";
import { db } from "../firestore";
import { CaseDto } from "../dto";
import { generateId } from "../utils";

@Service()
export class CaseDao {
  private static COLLECTION_NAME = "cases";

  public create = async (
      caseDto: Omit<CaseDto, "prescriptions">
  ): Promise<string | null> => {
    const dataCount = (await db.collection(`${CaseDao.COLLECTION_NAME}`).get())
        .size;
    const miniId = generateId(dataCount).toString();

    // const docId = id ?? toHex(nanoid(), { addPrefix: true });
    const caseRef = db.collection(CaseDao.COLLECTION_NAME).doc(miniId);
    const request = await caseRef.set({
      ...caseDto,
      createdAt: Date.now(),
    });

    return request?.writeTime ? miniId : null;
  };

  public getById = async (id: string): Promise<Case | null> => {
    const doc = await db.collection(CaseDao.COLLECTION_NAME).doc(id).get();

    return doc.exists && doc.data() ? (doc.data() as Case) : null;
  };

  public getAll = async (
      conditions: [keyof Case, WhereFilterOp, string | number][] = [],
      orderBy?: string,
      orderDirection?: "asc" | "desc"
  ): Promise<Case[]> => {
    const caseRef = db.collection(`${CaseDao.COLLECTION_NAME}`);

    const caseQuery = conditions.reduce(
        (acc: Query<DocumentData>, condition) =>
          acc.where(condition[0] as string, condition[1], condition[2]),
        caseRef
    );

    const caseSnapshot = await caseQuery
        .orderBy(orderBy || "createdAt", orderDirection || "asc")
        .get();

    if (caseSnapshot.empty) {
      return [];
    }

    const cases: Case[] = [];

    caseSnapshot.docs.forEach((doc) => {
      cases.push({ id: doc.id, ...doc.data() } as Case);
    });

    return cases;
  };
}
