import { FirestoreDataConverter, serverTimestamp } from '@angular/fire/firestore';
import { IProduct } from './product';

export const productConverter: FirestoreDataConverter<IProduct> = {
    toFirestore(product: IProduct) {
        return {
            ...product,
            updatedAt: serverTimestamp()
        };
    },
    fromFirestore(snapshot, options) {
        const data = snapshot.data(options) as IProduct;
        return {
            ...data,
            id: snapshot.id
        };
    }
};