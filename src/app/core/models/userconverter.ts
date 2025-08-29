import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import { IUser } from './user';

export const userConverter: FirestoreDataConverter<IUser> = {
    toFirestore(user: IUser) {
        return user;
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): IUser {
        const data = snapshot.data(options)! as IUser;
        return { ...data, id: snapshot.id };
    }
};