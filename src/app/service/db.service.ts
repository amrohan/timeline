import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  startAfter,
  getDoc,
} from '@angular/fire/firestore';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';

import { tweet } from '@model';
import { Observable, from, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  firestore = inject(Firestore);
  dbCollection = collection(this.firestore, 'mem');

  private readonly storage: Storage = inject(Storage);

  uploadImage(file: File) {
    const storageRef = ref(this.storage, file.name);
    uploadBytesResumable(storageRef, file);
  }

  public tweet = signal<tweet[]>([]);

  getTimeline(offset: number): Observable<tweet[]> {
    let queryFn = query(
      this.dbCollection,
      orderBy('date', 'desc'),
      limit(offset)
    );

    return collectionData(queryFn, {
      idField: 'id',
    }) as Observable<tweet[]>;
  }

  loadMore(timeLine: tweet): Observable<tweet[]> {
    let queryFn = query(
      this.dbCollection,
      orderBy('date', 'desc'),
      // this method checks the date and gets the next tweet
      startAfter(timeLine.date),
      limit(10)
    );

    return collectionData(queryFn, {
      idField: 'id',
    }) as Observable<tweet[]>;
  }

  addTimeLine(data: tweet): Observable<tweet> {
    const promise = addDoc(this.dbCollection, data).then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    });
    return from(promise).pipe(map(() => data)) as Observable<tweet>;
  }

  getTimeLineById(id: string): Observable<tweet> {
    const docRef = doc(this.dbCollection, id);
    const promise = getDoc(docRef);
    return from(promise).pipe(
      map((doc) => doc.data() as tweet)
    ) as Observable<tweet>;
  }

  updateTimeline(id: string, data: tweet): Observable<tweet> {
    const docRef = doc(this.dbCollection, id);
    const promise = updateDoc(docRef, data);
    return from(promise).pipe(() => of(data)) as Observable<tweet>;
  }

  deleteTimeline(id: string): Observable<void> {
    const docRef = doc(this.dbCollection, id);
    const promise = deleteDoc(docRef);
    return from(promise) as Observable<void>;
  }
}
