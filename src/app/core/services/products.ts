import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, getDocs, limit, query, Timestamp, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { IProduct } from '../models/product';
import { productConverter } from '../models/product-converter';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private _collectionName = "todos"
  private firestore = inject(Firestore);
  // private _batch = writeBatch(this.firestore);
  private colRef = collection(this.firestore, 'products').withConverter(productConverter);


  // Create New Collection
  async createItem(data: any): Promise<void> {
    const itemCollection = collection(this.firestore, this._collectionName);
    await addDoc(itemCollection, data);
  }

  // Create documents by mutlible
  createItems(data: any[]) {
    data.forEach(i => {
      this.createItem(i);
    })
  }

  // Get Product
  getItems(): Observable<any[]> {
    const itemCollection = collection(this.firestore, this._collectionName);
    return collectionData(itemCollection, { idField: "id" }).pipe(
      map((items) =>
        items.map((item) => {
          // Check if the Duedate is an instance of timestamp
          if (item['dueDate'] instanceof Timestamp) {
            return { ...item, dueDate: item['dueDate'].toDate() }
          }
          return item;
        })
      )
    )
  }

  async getItemsByIdsPromise(ids: string[]): Promise<any[]> {
    if (!ids || ids.length === 0) {
      return [];
    }

    const products: any[] = [];
    const itemCollection = collection(this.firestore, this._collectionName);

    try {
      // Firestore supports 'in' queries with up to 10 items per query
      const chunkSize = 10;
      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);

        // Build the query for this chunk
        const { where, query, getDocs } = await import('@angular/fire/firestore');
        const q = query(itemCollection, where('__name__', 'in', chunk));

        const snapshot = await getDocs(q);
        snapshot.forEach(docSnap => {
          if (docSnap.exists()) {
            products.push({ id: docSnap.id, ...docSnap.data() });
          }
        });
      }
      return products;
    } catch (error) {
      console.error('Error fetching products by IDs:', error);
      throw error;
    }
  }

  async getProductsByIds(id: string): Promise<IProduct | null> {
    const q = query(
      this.colRef,
      where('id', '==', id),
      limit(1)
    );

    const snap = await getDocs(q);
    if (snap.empty) {
      return null;
    }
    return snap.docs[0].data();
  }

  // Update an product by ID
  async updateItem(id: string, data: any): Promise<void> {
    const itemDoc = doc(this.firestore, `${this._collectionName}/${id}`);
    await updateDoc(itemDoc, data);
  }

  // Delete and product by ID
  async deleteItem(id: string): Promise<void> {
    const itemDoc = doc(this.firestore, `${this._collectionName}/${id}`);
    await deleteDoc(itemDoc);
  }
}
