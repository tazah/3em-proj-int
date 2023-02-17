import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { ChatRequestService } from '@app/services/database/chat-request/chat-request.service';
import { Chat } from '@common/chat/chat';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    @ViewChild('clearMe') myClearingContainer: ElementRef;
    newMessage: string;
    dataSourceChats: Chat[];

    constructor(
        public userAuthentificationService: UserAuthentificationService,
        public chatCommunicationService: ChatCommunicationService,
        public chatRequestService: ChatRequestService,
    ) {
        this.dataSourceChats = [];
    }
    ngOnInit(): void {}

    onKeyup(event: Event): void {
        const eventValue = (event.target as HTMLInputElement).value;
        const isMessageNotEmpty = !eventValue || !eventValue.replace(/\s/g, '');
        if (isMessageNotEmpty) return;
        this.chatCommunicationService.sendMessage(eventValue, this.userAuthentificationService.userProtected.userName as string);
        this.myClearingContainer.nativeElement.value = '';
    }

    sendMessage(): void {
        this.chatCommunicationService.sendMessage(this.newMessage, this.userAuthentificationService.userProtected.userName as string);
        this.myClearingContainer.nativeElement.value = '';
    }
}
