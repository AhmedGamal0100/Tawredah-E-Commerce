// users.service.ts
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  addDoc,
  query,
  where,
  limit,
  orderBy,
  startAfter,
  getDocs,
  writeBatch,
  docData,
  arrayUnion
} from '@angular/fire/firestore';
import { ref, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage';
import { userConverter } from '../models/userconverter';
import { Observable } from 'rxjs';
import { IUser } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private colRef = collection(this.firestore, 'users').withConverter(userConverter);

  /** CREATE (with auto id) */
  async create(user: Omit<IUser, 'id'>): Promise<string> {
    const docRef = await addDoc(this.colRef, user as IUser);
    // ensure the id field exists in doc as well (optional, but nice to have)
    await updateDoc(doc(this.firestore, 'users', docRef.id), { id: docRef.id });
    return docRef.id;
  }

  /** READ one as Observable (live updates) */
  get$(id: string): Observable<IUser | undefined> {
    const docRef = doc(this.firestore, 'users', id).withConverter(userConverter);
    return docData(docRef, { idField: 'id' }) as Observable<IUser | undefined>;
  }

  /** READ one once (Promise) */
  async getOnce(id: string): Promise<IUser | null> {
    const snap = await getDoc(doc(this.firestore, 'users', id).withConverter(userConverter));
    return snap.exists() ? (snap.data() as IUser) : null;
  }

  /** LIST with optional filters/pagination */
  async list(options?: {
    role?: 'user' | 'factory';
    pageSize?: number;
    orderByField?: keyof IUser;
    startAfterValue?: any; // value of the orderBy field from last doc
  }): Promise<{ items: IUser[]; lastValue?: any }> {
    const pageSize = options?.pageSize ?? 20;
    const orderField = (options?.orderByField ?? 'firstName') as string;

    let q = query(this.colRef, orderBy(orderField), limit(pageSize));
    if (options?.role) q = query(q, where('role', '==', options.role));
    if (options?.startAfterValue !== undefined) q = query(q, startAfter(options.startAfterValue));

    const snap = await getDocs(q);
    const items = snap.docs.map(d => d.data());
    const last = snap.docs.at(-1);
    const lastValue = last?.get(orderField);

    return { items, lastValue };
  }

  /** UPDATE (partial) */
  async update(id: string, patch: Partial<IUser>): Promise<void> {
    await updateDoc(doc(this.firestore, 'users', id), patch as any);
  }

  /** DELETE */
  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'users', id));
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const q = query(
      this.colRef,
      where('email', '==', email),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
      return null;
    }
    return snap.docs[0].data();
  }

  async getUserByBusinessName(businessName: string): Promise<IUser | null> {
  const q = query(
    this.colRef,
    where('businessName', '==', businessName),
    limit(1)
  );

  const snap = await getDocs(q);
  if (snap.empty) {
    return null;
  }
  return snap.docs[0].data();
}


  /** BATCH CREATE many users (fast & atomic) */
  // async createMany(users: Array<Omit<IUser, 'id'>>): Promise<string[]> {
  //   const batch = writeBatch(this.firestore);
  //   const ids: string[] = [];
  //   for (const u of users) {
  //     const newRef = doc(collection(this.firestore, 'users'));
  //     ids.push(newRef.id);
  //     batch.set(newRef, { ...u, id: newRef.id } as IUser);
  //   }
  //   await batch.commit();
  //   return ids;
  // }

  /** Upload avatar and save URL on user document */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileRef = ref(this.storage, `avatars/${userId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    await this.update(userId, { avatarUrl: url });
    return url;
  }


    /** Add product ID to user's products array */
  async addProductToUser(userId: string, productId: string): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await updateDoc(userRef, {
      products: arrayUnion(productId)
    });
  }

  // /** Remove product ID from user's products array */
  // async removeProductFromUser(userId: string, productId: string): Promise<void> {
  //   const userRef = doc(this.firestore, 'users', userId);
  //   const user = await this.getOnce(userId);
    
  //   if (user && user.productsList) {
  //     const updatedProducts = user.productsList.filter((id) => id !== productId);
  //     await updateDoc(userRef, {
  //       products: updatedProducts
  //     });
  //   }
  // }

  // /** Get all products for a specific user */
  // async getUserProducts(userId: string): Promise<string[]> {
  //   const user = await this.getOnce(userId);
  //   return user?.productsList || [];
  // }
}

