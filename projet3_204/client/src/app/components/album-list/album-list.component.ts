import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Album } from '@app/classes/interfaces/album/album';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { AlbumRequestService } from '@app/services/database/album-request/album-request.service';
//import { ChatRequestService } from '@app/services/database/chat-request/chat-request.service';

@Component({
    selector: 'app-album-list',
    templateUrl: './album-list.component.html',
    styleUrls: ['./album-list.component.scss'],
})
export class AlbumListComponent implements OnInit {
    dataSourceAlbums: Album[] = [];
    displayedColumns: string[];

    constructor(
        public dialog: MatDialog,
        public chatCommunicationService: ChatCommunicationService,
        public albumRequestService: AlbumRequestService,
        public userAuthentificationService: UserAuthentificationService,
        private router: Router,
    ) {
        // this.dataSourceAlbums = [{ name: 'album', owner: 'khaou', dateCreation: '2022 - 4 - 15', public: true, avatar: 'av', _id: '1' }];
        this.dataSourceAlbums = [];
        this.displayedColumns = ['Avatar', 'Nom', 'Créateur', 'Date de création', 'Supprimer', 'Rejoindre', 'Type'];
    }
    dataSource = new MatTableDataSource(this.dataSourceAlbums);
    ngOnInit(): void {
        this.refreshInfo();
    }

    isUserMemberOfAlbum(membersList: string[]): boolean {
        return membersList.includes(this.userAuthentificationService.userProtected.userName as string);
    }

    refreshInfo(): void {
        //this.dataSourceAlbums = (this.albumRequestService.albumList as unknown) as Album[];
        this.albumRequestService.getAllAlbum().subscribe(
            (albums: Album[]) => {
                this.albumRequestService.albumList = albums;
                this.dataSourceAlbums = (albums as unknown) as Album[];
                console.log(this.albumRequestService.albumList);
                console.log('🚀 ~ file: album.component.ts ~ line 28 ~ AlbumComponent ~ ngOnInit ~ albumList', this.albumRequestService.albumList);
            },
            (err: Error) => {
                console.log(err);
            },
        );
        this.displayedColumns = ['Avatar', 'Nom', 'Créateur', 'Date de création', 'Supprimer', 'Rejoindre', 'Type'];
        this.dataSource = new MatTableDataSource(this.dataSourceAlbums);
    }

    createAlbum(): void {
        // const a: Album = {
        //     name: 'fetst',
        //     owner: 'ddeed',
        //     dateCreation: '1010101',S
        //     socketIndex: 0,
        //     allMouvements: [],
        // };
        // this.chatCommunicationService.createRoom(this.userAuthentificationService.userProtected.userName as string, a, 'dewe');
        this.router.navigateByUrl('/album');
    }

    joinAlbum(albumName: string): void {
        // this.chatCommunicationService.joinRoom(this.userAuthentificationService.userProtected.userName as string, socketIndex);
        this.chatCommunicationService.currentSelectedAlbum = albumName;

        this.router.navigateByUrl('/album');
    }
    createRequest(albumId: string) {
        this.albumRequestService.joinRequest(this.userAuthentificationService.userProtected.userName as string, albumId).subscribe(
            (res) => {
                console.log(res);
            },
            (error: Error) => {
                console.log(error.message);
            },
        );
    }

    applyFilter(event: Event) {
        let filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
