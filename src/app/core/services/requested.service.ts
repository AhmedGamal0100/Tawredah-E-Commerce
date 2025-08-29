import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  docData,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  CollectionReference,
  collectionData,
  query,
  getDocs,
} from '@angular/fire/firestore';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { IProduct } from '../models/product';

@Injectable({ providedIn: 'root' })
export class RequestedService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  private colRef: CollectionReference<IProduct>;

  constructor() {
    this.colRef = collection(this.firestore, 'requestedProducts') as CollectionReference<IProduct>;
  }

  getRequestedProducts(): Observable<IProduct[]> {
    const colRef = collection(this.firestore, 'requestedProducts');
    return collectionData(colRef, { idField: 'id' }) as Observable<IProduct[]>;
  }

  async list(): Promise<IProduct[]> {
    const q = query(this.colRef);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as IProduct);
  }
  /** Upload a single file to Firebase Storage and return its download URL */
  private async uploadImage(file: File): Promise<string> {
    const ts = Date.now();
    const cleanName = file.name.replace(/\s+/g, '_');
    const storageRef = ref(this.storage, `requestedProducts/${ts}_${cleanName}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  }

  /** Upload multiple images and return their download URLs */
  private async uploadImages(files: File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];
    const urls: string[] = [];
    for (const f of files) {
      const url = await this.uploadImage(f);
      urls.push(url);
    }
    return urls;
  }

  /** CREATE (auto-generated ID) — saves into 'requestedProducts' and writes image URLs */
  async create(product: IProduct): Promise<string> {
    const newDocRef = doc(this.colRef);

    await setDoc(newDocRef, {
      ...product,
      id: newDocRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    } as IProduct);

    return newDocRef.id;
  }

  /** READ one as Observable (live updates) */
  get$(id: string): Observable<IProduct | undefined> {
    const docRef = doc(this.colRef, id);
    return docData(docRef, { idField: 'id' }) as Observable<IProduct | undefined>;
  }
  /** READ once (no live updates) */
  async getOnce(id: string): Promise<IProduct | null> {
    const snap = await getDoc(doc(this.colRef, id));
    return snap.exists() ? (snap.data() as IProduct) : null;
  }

  /** UPDATE — optionally replace images with newly uploaded ones */
  async update(id: string, patch: Partial<IProduct>, files?: File[]): Promise<void> {
    const imageUrls = files && files.length > 0 ? await this.uploadImages(files) : [];
    await updateDoc(doc(this.colRef, id), {
      ...patch,
      ...(imageUrls.length > 0 ? { images: imageUrls } : {}),
      updatedAt: serverTimestamp()
    });
  }

  /** DELETE */
  async remove(id: string): Promise<void> {
    await deleteDoc(doc(this.colRef, id));
  }
}

