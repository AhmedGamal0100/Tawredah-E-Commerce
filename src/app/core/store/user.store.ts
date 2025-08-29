// import { effect, inject } from '@angular/core';
// import { addDoc, collection, collectionData, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';
// import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
// import { IUser } from '../models/user';
// import { map, Observable, of, Subscription, tap } from 'rxjs';

// const initialFactories: IUser[] = [];
// const initialUsers: IUser[] = [];
// let factoriesSub = new Subscription();
// let usersSub = new Subscription();

// export const UserStore = signalStore(
//     { providedIn: 'root' },
//     withState({
//         collectionFactory: "usersFactory",
//         collectionUser: "usersUser",
//         factories: initialFactories,
//         users: initialUsers,
//     }),

//     withMethods((state) => {
//         const firestore = inject(Firestore);
//         return {
//             // Create New User or Factory
//             async createItem(data: IUser): Promise<void> {
//                 if (data.role === 'factory') {
//                     const itemCollection = collection(firestore, state.collectionFactory());
//                     await addDoc(itemCollection, data);
//                 } else if (data.role === 'user') {
//                     const itemCollection = collection(firestore, state.collectionUser());
//                     await addDoc(itemCollection, data);
//                 }
//             },

//             // Get All Factories
//             getAllFactories(): Observable<any[]> {
//                 const itemCollection = collection(firestore, state.collectionFactory());
//                 if (itemCollection) {
//                     return collectionData(itemCollection, { idField: "id" }).pipe(
//                         map((factories) => {
//                             return factories
//                         })
//                     );
//                 } else {
//                     return of(initialFactories);
//                 }
//             },

//             // Get All Users
//             getAllUsers(): Observable<any[]> {
//                 const itemCollection = collection(firestore, state.collectionUser());
//                 if (itemCollection) {
//                     return collectionData(itemCollection, { idField: "id" }).pipe(
//                         map((users) => {
//                             return users
//                         })
//                     );
//                 }
//                 else {
//                     return of(initialUsers);
//                 }
//             },
//             // Get factory by ID
//             getFactoryById(id: string): Observable<any> {
//                 const itemDoc = doc(firestore, `${state.collectionFactory()}/${id}`);
//                 return docData(itemDoc, { idField: "id" });
//             },

//             // Update a factory by ID
//             async updateFactory(id: string, key: string, data: any): Promise<void> {
//                 const itemDoc = doc(firestore, `${state.collectionFactory()}/${id}`);
//                 await updateDoc(itemDoc, { [key]: data });
//             },

//             // Get user by ID
//             getUserById(id: string): Observable<any> {
//                 const itemDoc = doc(firestore, `${state.collectionUser()}/${id}`);
//                 return docData(itemDoc, { idField: "id" });
//             },

//             // Update a user by ID
//             async updateUser(id: string, key: string, data: any): Promise<void> {
//                 const itemDoc = doc(firestore, `${state.collectionUser()}/${id}`);
//                 await updateDoc(itemDoc, { [key]: data });
//             },


//         }
//     }),


//     withHooks({
//         onInit(state) {
//             effect(() => {
//                 factoriesSub = state.getAllFactories().subscribe(
//                     data => {
//                         patchState(state, {
//                             factories: data
//                         })
//                     }
//                 );
//                 usersSub = state.getAllUsers().subscribe(
//                     data => {
//                         patchState(state, {
//                             users: data
//                         })
//                     }
//                 );
//             })
//         },

//         onDestroy(state) {
//             patchState(state, {
//                 factories: initialFactories,
//                 users: initialUsers,
//             });

//             factoriesSub.unsubscribe();
//             usersSub.unsubscribe();
//         }
//     })
// );

