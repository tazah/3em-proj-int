import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Album } from '@app/classes/interfaces/album/album';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { AlbumRequestService } from '@app/services/database/album-request/album-request.service';
import { ChatRequestService } from '@app/services/database/chat-request/chat-request.service';

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
    allAlbums: Album[] = [];
    constructor(
        public userAuthentificationService: UserAuthentificationService,
        public chatCommunicationService: ChatCommunicationService,
        private router: Router,
        public albumRequestService: AlbumRequestService,
        public chatRequestService: ChatRequestService,
    ) {
        // this.albumRequestService.initializeAllAlbums();
    }

    initializeAllAlbums() {
        this.albumRequestService.getAllAlbum().subscribe(
            (albums: Album[]) => {
                this.albumRequestService.albumList = albums;
                this.allAlbums = albums;
                this.albumRequestService.albumListAfterLoad = Promise.resolve(true);
                console.log('here is all albums', albums);
            },
            (err: Error) => {
                console.log(err);
            },
        );
    }

    ngOnInit(): void {
        // this.initializeAllAlbums();
    }

    createRoom(): void {
        this.router.navigateByUrl('/editor');
    }
    joinRoom(): void {
        this.chatCommunicationService.joinRoom(this.userAuthentificationService.userProtected.userName as string, 0);
        this.router.navigateByUrl('/editor');
    }
}
