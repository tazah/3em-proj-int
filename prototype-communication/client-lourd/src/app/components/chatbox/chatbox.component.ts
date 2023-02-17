import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';

@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    @ViewChild('clearMe') myClearingContainer: ElementRef;
    newMessage: string;

    constructor(public userAuthentificationService: UserAuthentificationService, public chatCommunicationService: ChatCommunicationService) {}
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
