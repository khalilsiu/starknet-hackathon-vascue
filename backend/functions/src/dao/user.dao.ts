import { Service } from "typedi";
import { nanoid } from "nanoid";
import { db } from "../firestore";
import { UserDto } from "../dto";
import { DocumentData, Query, WhereFilterOp } from "@google-cloud/firestore";

@Service()
export class UserDao {
  private static COLLECTION_NAME = "users";

  public create = async (
    user: UserDto,
    id?: string
  ): Promise<string | null> => {
    const docId = id ?? nanoid();
    const userRef = db.collection(UserDao.COLLECTION_NAME).doc(docId);
    const request = await userRef.set({
      ...user,
      createdAt: Date.now(),
    });

    return request?.writeTime ? docId : null;
  };

  public isDuplicated = async (walletId: string): Promise<Boolean> => {
    const users = await this.getAll([["walletId", "==", walletId]]);
    return users.length > 0;
  };

  public getById = async (id: string): Promise<User | null> => {
    const doc = await db.collection(UserDao.COLLECTION_NAME).doc(id).get();

    return doc.exists && doc.data() ? (doc.data() as User) : null;
  };

  public getAll = async (
    conditions: [keyof User, WhereFilterOp, string | number][] = []
  ): Promise<User[]> => {
    const userRef = db.collection(`${UserDao.COLLECTION_NAME}`);

    const userQuery = conditions.reduce(
      (acc: Query<DocumentData>, condition) =>
        acc.where(condition[0] as string, condition[1], condition[2]),
      userRef
    );

    const userSnapshot = await userQuery.get();

    if (userSnapshot.empty) {
      return [];
    }

    const users: User[] = [];

    userSnapshot.docs.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() } as User);
    });

    return users;
  };
}
