// tslint:disable:no-relative-imports
import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { SnackBarService } from '../snackBar/snack-bar.service';
interface HTMLInputEvent extends Event {
    target: HTMLInputElement & EventTarget;
}
@Injectable({
    providedIn: 'root',
})
export class AvatarService {
    // tslint:disable-next-line: no-any
    filePath: File;
    fireBaseFileUrl: string;
    constructor(private angulareFireStorage: AngularFireStorage, private snackBarService: SnackBarService) {}
    verifyIfFileIsUploaded(event?: HTMLInputEvent): boolean {
        if (event?.target.files && event?.target.files[0]) return true;
        return false;
    }
    upload(event?: HTMLInputEvent): void {
        if (event?.target.files && event?.target.files[0]) {
            this.filePath = event.target.files[0];
        }
        console.log('file path : ', this.filePath);
    }

    uploadImage(): AngularFireUploadTask {
        const fileName = this.filePath.name;
        console.log(fileName, 'nom du file');

        return this.angulareFireStorage.upload(fileName, this.filePath);
    }

    getUrl(): void {
        this.uploadImage().then(
            (task) => {
                console.log('chui dans task');
                task.ref.getDownloadURL().then(
                    (url: string) => {
                        console.log(url);
                        this.fireBaseFileUrl = url;
                        this.snackBarService.openSnackBar3SecondTime('Votre photo de profile a été entregistrée avec succès !');
                    },
                    (error) => {
                        console.log(error.code);
                        this.snackBarService.openSnackBar3SecondTime('Une erreur est survenue lors du téléversement !');
                    },
                );
            },
            (error) => {
                console.log(error.message);
                this.snackBarService.openSnackBar3SecondTime('Une erreur est survenue lors du téléversement !');
            },
        );
    }
}
