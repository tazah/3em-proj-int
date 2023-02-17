import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';

interface Comment {
    author: string;
    comment: string;
}
const ELEMENT_DATA_COMMENTS: Comment[] = [{ author: 'Joe', comment: 'Un très beau dessin' }];

@Component({
    selector: 'app-drawing-info',
    templateUrl: './drawing-info.component.html',
    styleUrls: ['./drawing-info.component.scss'],
})
export class DrawingInfoComponent implements OnInit {
    dataSourceComments: Comment[];
    displayedColumnsCommentTable: string[];
    constructor(
        public userAuthentificationService: UserAuthentificationService,
        public chatCommunicationService: ChatCommunicationService,
        private router: Router,
        public dialog: MatDialog,
    ) {
        this.dataSourceComments = ELEMENT_DATA_COMMENTS;
        this.displayedColumnsCommentTable = ['Commentaires'];
    }

    ngOnInit(): void {
        this.dataSourceComments = ELEMENT_DATA_COMMENTS;
        this.displayedColumnsCommentTable = ['Commentaires'];
        this.refreshInfo();
    }

    refreshInfo() {
        // this is pseudo code for what we might put to update comment list
        // this.communicationService.requestsGet().subscribe(
        //     (results) => (this.dataSourceDictionary = results),
        //     () => {
        //         this.openSnackBar('Impossible de rafraichir la liste de commentaires');
        //     },
        // );
    }

    joinRoom(): void {
        this.chatCommunicationService.joinRoom(this.userAuthentificationService.userProtected.userName as string, 1);
        this.router.navigateByUrl('/editor');
        this.dialog.closeAll();
    }
}
