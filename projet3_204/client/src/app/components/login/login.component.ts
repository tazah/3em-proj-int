import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { AlbumRequestService } from '@app/services/database/album-request/album-request.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup = this.userAuthentificationService.loginForm;
    // loginForm!: FormGroup;
    constructor(
        public chatCommunicationService: ChatCommunicationService,
        public userAuthentificationService: UserAuthentificationService,
        public albumRequestService: AlbumRequestService,
    ) {
        this.chatCommunicationService.socketInit();
        this.albumRequestService.initializeAllAlbums();
    }

    ngOnInit(): void {}

    submitOnLogginForm(): void {
        this.userAuthentificationService.getEmailWhenSubscribeWithUsername(
            (this.loginForm.get('username')?.value as unknown) as string,
            (this.loginForm.get('password')?.value as unknown) as string,
        );
    }
}
