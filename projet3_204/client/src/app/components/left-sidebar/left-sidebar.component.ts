import { Component, OnInit } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';

@Component({
    selector: 'app-left-sidebar',
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss'],
})
export class LeftSidebarComponent implements OnInit {
    constructor(public userAuthentificationService: UserAuthentificationService, public chatCommunicationService: ChatCommunicationService) {}

    ngOnInit(): void {}
}
