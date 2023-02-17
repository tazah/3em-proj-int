/* eslint-disable no-console */
import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '@app/classes/message';
import { UserAuthentificationService } from '@app/services/authentification/user-authentification.service';
import { ChatCommunicatioService } from '@app/services/chat-communication-service/chat-communicatio-service.service';
import { CommunicationService } from '@app/services/communication.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    @ViewChild('scrollMe') myScrollContainer: ElementRef;
    @ViewChild('clearMe') myClearingContainer: ElementRef;
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(
        private readonly communicationService: CommunicationService,
        public chatCommunicationService: ChatCommunicatioService,
        public userAuthentificationService: UserAuthentificationService,
    ) {
        this.chatCommunicationService.socketInit();
    }
    sendTimeToServer(): void {
        const newTimeMessage: Message = {
            title: 'Hello from the client',
            body: 'Time is : ' + new Date().toString(),
        };
        // Important de ne pas oublier "subscribe" ou l'appel ne sera jamais lancé puisque personne l'observe
        this.communicationService.basicPost(newTimeMessage).subscribe();
    }

    getMessagesFromServer(): void {
        this.communicationService
            .basicGet()
            // Cette étape transforme l'objet Message en un seul string
            .pipe(
                map((message: Message) => {
                    return `${message.title} ${message.body}`;
                }),
            )
            .subscribe(this.message);
    }
    btnTest(): void {
        this.chatCommunicationService.btnClick();
    }
    scrollToBottom(): void {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    }

    onKeyup(event: Event): void {
        const eventValue = (event.target as HTMLInputElement).value;
        const isMessageNotEmpty = !eventValue || !eventValue.replace(/\s/g, '');
        if (isMessageNotEmpty) return;
        this.chatCommunicationService.sendMessage(eventValue);
        this.myClearingContainer.nativeElement.value = '';
    }
}
