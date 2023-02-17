import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UserAuthentificationService } from '@app/services/authentification/user-authentification.service';
import { ChatCommunicatioService } from '@app/services/chat-communication-service/chat-communicatio-service.service';
@Component({
    selector: 'app-chatbox',
    templateUrl: './chatbox.component.html',
    styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
    @ViewChild('clearMe') myClearingContainer: ElementRef;
    constructor(public userAuthentificationService: UserAuthentificationService, public chatCommunicationService: ChatCommunicatioService) {}

    ngOnInit(): void {}

    onKeyup(event: Event): void {
        const eventValue = (event.target as HTMLInputElement).value;
        const isMessageNotEmpty = !eventValue || !eventValue.replace(/\s/g, '');
        if (isMessageNotEmpty) return;
        this.chatCommunicationService.sendMessage(eventValue);
        this.myClearingContainer.nativeElement.value = '';
    }
}
