import { DocumentData, Query, WhereFilterOp } from "@google-cloud/firestore";
import { Service } from "typedi";
import { db } from "../firestore";
import { PrescriptionDto } from "../dto";
import { generateId } from "../utils";

@Service()
export class PrescriptionDao {
  private static COLLECTION_NAME = "prescriptions";

  public create = async (
      prescription: PrescriptionDto
  ): Promise<string | null> => {
    const dataCount = (
      await db.collection(`${PrescriptionDao.COLLECTION_NAME}`).get()
    ).size;
    const miniId = generateId(dataCount).toString();

    // const docId = id ?? toHex(nanoid(), { addPrefix: true });
    const prescriptionRef = db
        .collection(PrescriptionDao.COLLECTION_NAME)
        .doc(miniId);
    const request = await prescriptionRef.set({
      ...prescription,
      createdAt: Date.now(),
    });

    return request?.writeTime ? miniId : null;
  };

  public getById = async (id: string): Promise<Prescription | null> => {
    const doc = await db
        .collection(PrescriptionDao.COLLECTION_NAME)
        .doc(id)
        .get();

    return doc.exists && doc.data() ? (doc.data() as Prescription) : null;
  };

  public getAll = async (
      conditions: [keyof Prescription, WhereFilterOp, string | number][] = [],
      orderBy?: string,
      orderDirection?: "asc" | "desc"
  ): Promise<Prescription[]> => {
    const prescriptionRef = db.collection(`${PrescriptionDao.COLLECTION_NAME}`);

    const prescriptionQuery = conditions.reduce(
        (acc: Query<DocumentData>, condition) =>
          acc.where(condition[0] as string, condition[1], condition[2]),
        prescriptionRef
    );

    const prescriptionSnapshot = await prescriptionQuery
        .orderBy(orderBy || "createdAt", orderDirection || "asc")
        .get();

    if (prescriptionSnapshot.empty) {
      return [];
    }

    const prescriptions: Prescription[] = [];

    prescriptionSnapshot.docs.forEach((doc) => {
      prescriptions.push({ id: doc.id, ...doc.data() } as Prescription);
    });

    return prescriptions;
  };
}
