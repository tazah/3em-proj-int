import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { AlbumRequestService } from '@app/services/database/album-request/album-request.service';
import { DrawingDb } from '@common/drawing/drawingDb';

@Component({
    selector: 'app-album-modal',
    templateUrl: './album-modal.component.html',
    styleUrls: ['./album-modal.component.scss'],
})
export class AlbumModalComponent {
    drawingNameForm: FormGroup;

    constructor(
        private dialogRef: MatDialog,
        private formBuilder: FormBuilder,
        public userAuthentificationService: UserAuthentificationService,
        public albumRequestService: AlbumRequestService,
        public chatCommunicationService: ChatCommunicationService,
        public router: Router,
        public snackBar: MatSnackBar,
    ) {
        this.drawingNameForm = this.formBuilder.group({
            drawingName: new FormControl('', [Validators.minLength(6), Validators.required, Validators.pattern('[a-zA-Z0-9]*')]),
        });
    }

    closeModal(): void {
        this.dialogRef.closeAll();
    }

    submit(): void {
        //this.addNewDrawing();
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const dateTime = date + ' ' + time;

        const drawing: DrawingDb = {
            drawingName: (this.drawingNameForm.get('drawingName')?.value as unknown) as string,
            owner: (this.userAuthentificationService.userProtected.userName as unknown) as string,
            dateOfCreation: dateTime,
            socketIndex: -1,
            allMouvements: [],
        };
        this.createRoom(drawing, this.albumRequestService.albumList[0].name);
    }
    createRoom(drawing: DrawingDb, albumName: string): void {
        this.chatCommunicationService.createRoom(this.userAuthentificationService.userProtected.userName as string, drawing, albumName);
        this.router.navigateByUrl('/editor');
    }
    addNewDrawing(): void {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        const dateTime = date + ' ' + time;

        const drawing: DrawingDb = {
            drawingName: (this.drawingNameForm.get('drawingName')?.value as unknown) as string,
            owner: (this.userAuthentificationService.userProtected.userName as unknown) as string,
            dateOfCreation: dateTime,
            socketIndex: 10,
            allMouvements: [],
        };
        console.log('🚀 ~ file: album-modal.component.ts ~ line 40 ~ AlbumModalComponent ~ addNewDrawing ~ drawing', drawing);

        this.albumRequestService.addNewDrawing(drawing, this.albumRequestService.albumList[0].name).subscribe(
            (codeSuccess) => {
                this.snackBar.open('Le dessin a été ajouté avec succès!!', 'Fermer', {
                    duration: 4000,
                });
                // this.createRoom(drawing, this.albumRequestService.albumList[0].name);
                console.log(codeSuccess);
                this.closeModal();
            },
            (err: Error) => {
                console.log(err);
                this.snackBar.open("Erreur lors de l'ajout du dessin !!", 'Fermer', {
                    duration: 4000,
                });
            },
        );
    }

    get drawingName(): AbstractControl | null {
        return this.drawingNameForm.get('drawingName');
    }
}
