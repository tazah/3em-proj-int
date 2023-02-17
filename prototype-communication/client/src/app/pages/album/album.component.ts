import { Component, OnInit } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/user-authentification.service';
import { ChatCommunicatioService } from '@app/services/chat-communication-service/chat-communicatio-service.service';

@Component({
    selector: 'app-album',
    templateUrl: './album.component.html',
    styleUrls: ['./album.component.scss'],
})
export class AlbumComponent implements OnInit {
    constructor(public userAuthentificationService: UserAuthentificationService, public chatCommunicationService: ChatCommunicatioService) {}

    ngOnInit() {}
}
