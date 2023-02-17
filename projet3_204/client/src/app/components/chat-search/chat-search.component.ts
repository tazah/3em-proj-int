import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { ChatRequestService } from '@app/services/database/chat-request/chat-request.service';
import { Chat } from './../../../../../common/chat/chat';
import { RightSidebarComponent } from './../../components/right-sidebar/right-sidebar.component';

interface ChatElement {
    id: number;
    name: string;
}

@Component({
    selector: 'app-chat-search',
    templateUrl: './chat-search.component.html',
    styleUrls: ['./chat-search.component.scss'],
})
export class ChatSearchComponent implements OnInit {
    // @Input() inputFromParent: boolean;
    @Output() outputFromChild: EventEmitter<boolean> = new EventEmitter();
    isChatOpen: boolean;
    dataSourceChats: Chat[] = [];
    displayedColumns: string[];
    clickedRow = new Set<ChatElement>();
    constructor(
        public rightSidebar: RightSidebarComponent,
        public chatRequestService: ChatRequestService,
        public chatCommunicationService: ChatCommunicationService,
        public userAuthentificationService: UserAuthentificationService,
    ) {
        this.dataSourceChats = [];
        this.displayedColumns = ['Chat', 'Index', 'Créateur'];
        this.isChatOpen = true;
    }
    dataSource = new MatTableDataSource(this.dataSourceChats);
    ngOnInit(): void {
        this.refreshInfo();
    }

    // here you are getting the chats and we put it in dataSourceChats from the db
    refreshInfo(): void {
        this.chatRequestService.getAllChats().subscribe(
            (chats: Chat[]) => {
                this.dataSourceChats = chats as Chat[];
                console.log('SOURCE', this.dataSourceChats);
            },
            (err: Error) => {
                console.log(err);
            },
        );
        this.dataSource = new MatTableDataSource(this.dataSourceChats);
    }

    applyFilter(event: Event) {
        let filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // use this to create a new chat .. you need to input the chat name
    //add an attribute to that component to store the chat name in and send it to the methode
    createChat(chatName: string) {
        //const chatName: string = 'chatNameTest';
        this.chatCommunicationService.createChat(chatName, this.userAuthentificationService.userProtected.userName as string);
        this.outputFromChild.emit(this.isChatOpen);
    }

    // this methode is to use to join a chat .. each element in the chatList has the chatIndex .
    //when u click on the row you need to pass chatIndex to this methode
    joinChat(chatIndex: number) {
        console.log('joinChat clicked');
        this.chatCommunicationService.joinChat(this.userAuthentificationService.userProtected.userName as string, chatIndex);
        this.outputFromChild.emit(this.isChatOpen);
    }
}
