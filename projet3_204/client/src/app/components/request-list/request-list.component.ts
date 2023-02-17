import { Component, OnInit } from '@angular/core';
import { Album } from '@app/classes/interfaces/album/album';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { AlbumRequestService } from '@app/services/database/album-request/album-request.service';
@Component({
    selector: 'app-request-list',
    templateUrl: './request-list.component.html',
    styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
    dataSourceRequests: string[];
    displayedColumnsRequestTable: string[];
    constructor(private albumService: AlbumRequestService, public chatCommunicationService: ChatCommunicationService) {
        this.dataSourceRequests = [];
        this.displayedColumnsRequestTable = ['Nom'];
        this.refreshInfo();
    }

    ngOnInit(): void {
        this.refreshInfo();
    }

    refreshInfo(): void {
        console.log('here we have');
        const selectAlbum: Album = this.albumService.albumList.filter(
            (album) => album.name === this.chatCommunicationService.currentSelectedAlbum,
        )[0];
        console.log('found selectAlbum', selectAlbum);
        if (selectAlbum != undefined) {
            this.dataSourceRequests = selectAlbum.requets as string[];
        } else {
            this.dataSourceRequests = [];
        }
        console.log('here is requests', this.dataSourceRequests);

        this.displayedColumnsRequestTable = ['Nom'];
    }

    acceptRequest(name: string): void {
        // accepts the member
        return;
    }

    rejectRequest(name: string): void {
        // rejects the member
        return;
    }
}
