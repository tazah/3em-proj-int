// tslint:disable:no-relative-imports
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { DrawingDb, LightDrawing } from '../../../../../common/drawing/drawingDb';
import { Album } from '../../classes/interfaces/album/album';
import { DrawingInfoComponent } from '../drawing-info/drawing-info.component';
import { AlbumRequestService } from './../../../../../client/src/app/services/database/album-request/album-request.service';
import { AlbumModalComponent } from './../../modals/album-modal/album-modal.component';
@Component({
    selector: 'app-drawing-grid',
    templateUrl: './drawing-grid.component.html',
    styleUrls: ['./drawing-grid.component.scss'],
})
export class DrawingGridComponent implements OnInit {
    albumName: string;
    drawingNames: LightDrawing[];
    constructor(
        public dialog: MatDialog,
        public chatCommunicationService: ChatCommunicationService,
        public albumRequestService: AlbumRequestService,
        public userAuthentificationService: UserAuthentificationService,
        private router: Router,
    ) {
        this.albumName = '';
        this.drawingNames = [];
        this.refreshInfo();
    }

    openDrawing(): void {
        this.dialog.open(DrawingInfoComponent);
    }

    apenAddDialogue(): void {
        this.dialog
            .open(AlbumModalComponent, {
                width: '350px',
                height: 'auto',
            })
            .afterClosed()
            .subscribe(() => this.refreshInfo());
    }

    ngOnInit(): void {
        this.refreshInfo();
        // this.addNewDrawing();
    }

    refreshInfo(): void {
        const selectAlbum: Album = this.albumRequestService.albumList.filter(
            (album) => album.name === this.chatCommunicationService.currentSelectedAlbum,
        )[0];
        if (selectAlbum != undefined) {
            this.albumName = selectAlbum.name;
            this.drawingNames = (selectAlbum.drawings as unknown) as LightDrawing[];
        } else {
            this.albumName = 'vide';
            this.drawingNames = [];
        }
    }

    createRoom(): void {
        const d: DrawingDb = {
            drawingName: 'fetst',
            owner: 'ddeed',
            dateOfCreation: '1010101',
            socketIndex: 0,
            allMouvements: [],
        };
        this.chatCommunicationService.createRoom(this.userAuthentificationService.userProtected.userName as string, d, 'dewe');
        this.router.navigateByUrl('/editor');
    }
    joinRoom(socketIndex: number): void {
        console.log('THE SELECTED SOCKET INDEX IS', socketIndex);
        this.chatCommunicationService.joinRoom(this.userAuthentificationService.userProtected.userName as string, socketIndex);
        this.router.navigateByUrl('/editor');
    }
}
