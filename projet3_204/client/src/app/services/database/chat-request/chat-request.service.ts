// tslint:disable: no-relative-imports
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Chat } from './../../../../../../common/chat/chat';
import { Message } from './../../../../../../common/Message/message';
import { User } from './../../../../../../common/user/user';
import {
    URL_ADD_CHAT,
    URL_ADD_MESSAGE_PUBLIC_CHAT,
    URL_ADD_TO_PUBLIC_CHATS,
    URL_GET_ALL_CHATS,
    URL_GET_PUBLIC_CHAT,
} from './../../../constants/http-request-routs';

@Injectable({
    providedIn: 'root',
})
export class ChatRequestService {
    baseUrl: string;

    constructor(private http: HttpClient) {}

    addNewChat(chat: Chat): Observable<number | Chat> {
        return this.http.post<number | Chat>(URL_ADD_CHAT, chat).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    getAllChats(): Observable<number | Chat[]> {
        return this.http.get<Chat[]>(URL_GET_ALL_CHATS);
    }

    getPublicChat(): Observable<number | Chat[]> {
        return this.http.get<Chat[]>(URL_GET_PUBLIC_CHAT);
    }

    addPublicChatNewUser(user: User): Observable<number | User> {
        return this.http.post<number | User>(URL_ADD_TO_PUBLIC_CHATS, user).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }

    addNewMessageToPublicChat(message: Message): Observable<number | Message> {
        return this.http.post<number | Message>(URL_ADD_MESSAGE_PUBLIC_CHAT, message).pipe(
            catchError((error: HttpErrorResponse) => {
                return of(error.status);
            }),
        );
    }
}
