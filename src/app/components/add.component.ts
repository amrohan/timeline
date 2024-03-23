import { Component, Inject, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FullscreenComponent } from './fullscreen.component';
import { tweet } from '@model';

import {
  Storage,
  ref,
  uploadBytesResumable,
  getMetadata,
  getDownloadURL,
  deleteObject,
  UploadTask,
  StorageReference,
  UploadTaskSnapshot,
} from '@angular/fire/storage';
import { DbService } from '../service/db.service';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [RouterLink, FormsModule, FullscreenComponent, NgStyle],
  templateUrl: './add.component.html',
})
export class AddComponent {
  selectedDate: string;
  timeline: tweet = {
    title: '',
    description: '',
    date: new Date(),
    image: '',
  };

  fileData: File;

  progress = signal<number>(0);
  uploadProgress: number;

  imageSrc: string | ArrayBuffer = '';
  showFullscreen = false;

  private readonly storage: Storage = inject(Storage);
  private readonly dbService = inject(DbService);

  onAdd() {
    this.dbService.addTimeLine(this.timeline).subscribe((res) => {
      console.log(res);
    });
  }

  uploadFile() {
    const storageRef = this.getStorageRef(this.fileData.name);
    const uploadTask = this.createUploadTask(storageRef, this.fileData);

    this.handleUploadState(uploadTask);
  }

  getStorageRef(fileName: string) {
    return ref(this.storage, fileName);
  }

  createUploadTask(storageRef: StorageReference, fileData: File) {
    return uploadBytesResumable(storageRef, fileData);
  }

  handleUploadState(uploadTask: UploadTask) {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        this.handleSnapshot(snapshot);
      },
      (error) => console.log(error),
      () => this.handleCompletion(uploadTask)
    );
  }

  async handleSnapshot(snapshot: UploadTaskSnapshot) {
    let prog = Math.round(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    );
    // this.progress.set(prog);
    this.uploadProgress = prog;
    console.log('Upload is ' + this.uploadProgress + '% done');
  }

  handleCompletion(uploadTask: UploadTask) {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      this.timeline.image = downloadURL;
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.fileData = file;
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.imageSrc = e.target.result;
    };

    reader.readAsDataURL(file);
    this.uploadFile();
  }

  removeFile() {
    this.imageSrc = '';
    this.timeline.image = '';
    this.uploadProgress = 0;
    this.removeFileFromStorage(this.fileData.name);
  }

  removeFileFromStorage(fileName: string) {
    const storageRef = ref(this.storage, fileName);
    deleteObject(storageRef).then(() => {
      console.log('🚀 ~ EditComponent ~ removeFileFromStorage ~ Deleted');
    });
  }
}
