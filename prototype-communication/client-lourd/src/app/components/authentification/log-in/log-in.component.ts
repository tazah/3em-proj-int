import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';
import { UserAuthentificationService } from '@app/services/authentification/user-authentification.service';
import { ChatCommunicatioService } from '@app/services/chat-communication-service/chat-communicatio-service.service';
@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html',
    styleUrls: ['./log-in.component.scss'],

})
export class LogInComponent implements OnInit {
    loginForm: FormGroup = this.userAuthentificationService.loginForm;
    constructor(public userAuthentificationService: UserAuthentificationService,  public chatCommunicationService: ChatCommunicatioService) {
            this.chatCommunicationService.socketInit();
    }

    ngOnInit() {
    }

     submitOnLogginForm() {
        this.userAuthentificationService.getEmailWhenSubscribeWithUsername(
            this.loginForm.get('username')?.value as unknown as string,
            this.loginForm.get('password')?.value as unknown as string)
    }




}
