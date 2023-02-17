import { Component, OnInit } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';

@Component({
    selector: 'app-right-sidebar',
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.scss'],
})
export class RightSidebarComponent implements OnInit {
    public isChatOpen: boolean;
    constructor(public chatCommunicationService: ChatCommunicationService, public userAuthentificationService: UserAuthentificationService) {
        this.isChatOpen = true;
    }

    ngOnInit(): void {}

    backToChats(): void {
        this.isChatOpen = false;
    }

    leaveChat() {
        this.chatCommunicationService.leaveChatRoom(this.userAuthentificationService.userProtected.userName as string);
        this.isChatOpen = false;
    }

    openChat(): void {
        this.isChatOpen = true;
    }

    receiveChildData(data: any) {
        console.log(data);
        this.isChatOpen = true;
    }
}
