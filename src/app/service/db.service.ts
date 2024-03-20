import { Injectable, inject, signal } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { tweet } from '@model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  // firestore = inject(Firestore);
  // dbCollection = collection(this.firestore, 'project');

  // public article = signal<Article[]>([]);

  firestore = inject(Firestore);
  dbCollection = collection(this.firestore, 'mem');

  public tweet = signal<tweet[]>([]);

  getProject(): Observable<tweet[]> {
    return collectionData(this.dbCollection, {
      idField: 'id',
    }) as Observable<tweet[]>;
  }
}
