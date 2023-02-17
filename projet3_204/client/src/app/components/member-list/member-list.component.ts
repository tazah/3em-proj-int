import { Component, OnInit } from '@angular/core';
import { Album } from '@app/classes/interfaces/album/album';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { AlbumRequestService } from '@app/services/database/album-request/album-request.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
    dataSourceMembers: string[];
    displayedColumnsMemberTable: string[];
    constructor(private albumService: AlbumRequestService, public chatCommunicationService: ChatCommunicationService) {
        this.dataSourceMembers = [];
        this.displayedColumnsMemberTable = ['Nom'];
        this.refreshInfo();
    }

    ngOnInit(): void {
        this.dataSourceMembers = [];
        this.displayedColumnsMemberTable = ['Nom'];
        this.refreshInfo();
    }

    refreshInfo(): void {
        const selectAlbum: Album = this.albumService.albumList.filter(
            (album) => album.name === this.chatCommunicationService.currentSelectedAlbum,
        )[0];

        if (selectAlbum != undefined) {
            this.dataSourceMembers = selectAlbum.members as string[];
        } else {
            this.dataSourceMembers = [];
        }
    }
}
