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
  serverTimestamp
} from '@angular/fire/firestore';
import { ref, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product';
import { productConverter } from '../models/product-converter';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);
  private colRef = collection(this.firestore, 'products').withConverter(productConverter);

  /** CREATE (auto ID) */
  async create(product: Omit<IProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(this.colRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    } as IProduct);
    await updateDoc(doc(this.firestore, 'products', docRef.id), { id: docRef.id });
    return docRef.id;
  }

  /** READ one as Observable (live) */
  get$(id: string): Observable<IProduct | undefined> {
    const docRef = doc(this.firestore, 'products', id).withConverter(productConverter);
    return docData(docRef, { idField: 'id' }) as Observable<IProduct | undefined>;
  }

  /** READ one once */
  async getOnce(id: string): Promise<IProduct | null> {
    const snap = await getDoc(doc(this.firestore, 'products', id).withConverter(productConverter));
    return snap.exists() ? (snap.data() as IProduct) : null;
  }

  /** LIST with optional filters and pagination */
  async list(options?: {
    categoryMain?: string;
    supplierId?: string;
    pageSize?: number;
    orderByField?: keyof IProduct;
    startAfterValue?: any;
  }): Promise<{ items: IProduct[]; lastValue?: any }> {

    const pageSize = options?.pageSize ?? 80;

    const orderField = (options?.orderByField ?? 'name') as string;

    let q = query(this.colRef, orderBy(orderField), limit(pageSize));

    if (options?.categoryMain) {
      q = query(q, where('category.main', '==', options.categoryMain));
    }

    if (options?.supplierId) {
      q = query(q, where('supplier.id', '==', options.supplierId));
    }

    if (options?.startAfterValue !== undefined) {
      q = query(q, startAfter(options.startAfterValue));
    }

    const snap = await getDocs(q);
    const items = snap.docs.map(d => d.data());
    const last = snap.docs.at(-1);
    const lastValue = last?.get(orderField);

    return { items, lastValue };
  }

  /** UPDATE (partial) */
  async update(id: string, patch: Partial<IProduct>): Promise<void> {
    await updateDoc(doc(this.firestore, 'products', id), {
      ...patch,
      updatedAt: serverTimestamp()
    });
  }

  /** DELETE */
  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.firestore, 'products', id));
  }

  /** Upload product image & update product */
  async uploadImage(productId: string, file: File): Promise<string> {
    const fileRef = ref(this.storage, `products/${productId}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    const product = await this.getOnce(productId);
    if (product) {
      await this.update(productId, { imageUrl: [...(product.imageUrl || []), url] });
    }
    return url;
  }
}
