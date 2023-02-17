import { Injectable } from '@angular/core';
import { StrokeTool } from '@app/classes/stroke-tool';
import { Message } from '@common/classes/message/message';
import { Movement, Type } from '@common/classes/movement';
import * as io from 'socket.io-client';
import { DrawingDb } from '../../../../../common/drawing/drawingDb';

@Injectable({
    providedIn: 'root',
})
export class ChatCommunicationService {
    chatHistory: Message[];
    socket: io.Socket;
    username: string;
    initFalg: boolean = false;
    tool: StrokeTool;
    currentCollabRoom: number = -1;
    currentChatRoom: number = 0;
    currentSelectedAlbum: string = 'eweeee';
    private readonly hostName: string = 'http://localhost:3000/';

    constructor() {
        this.chatHistory = [];

        this.socket = io.connect(this.hostName, { transports: ['websocket'] });
    }

    socketInit(): void {
        this.socket.on('new update', (movement: Movement) => {
            if (movement.type === Type.PENCIL) {
            }
        });
        if (!this.initFalg) {
            this.initFalg = true;

            this.socket.on('receiveMessage', (message: string, time: string, sender: string) => {
                console.log('we have received yhis', message);
                const msg: Message = { message, time, sender };

                this.chatHistory.push(msg);
            });
        }
        this.socket.on('sucess join', (collabRoomIndex: number, previousMovements: Movement[]) => {
            this.currentCollabRoom = collabRoomIndex;
            //this.drawPrevious(previousMovements);
        });
        this.socket.on('sucess join chat', (chatRoomIndex: number, previousMessages: Message[]) => {
            this.currentChatRoom = chatRoomIndex;
            console.log('THIS IS CHAT HISTORY ', previousMessages, ' of this chat', chatRoomIndex);
        });
    }
    drawPrevious(previousMovements: Movement[]): void {
        for (const mvt of previousMovements) {
            console.log(mvt);
        }
    }

    sendMessage(message: string, sender: string): void {
        console.log('message in client', message);
        this.socket.emit('onSendMessage', message, sender, this.currentChatRoom);
    }

    createRoom(username: string, drawing: DrawingDb, albumName: string): void {
        this.socket.emit('create Collaboration Room', username, drawing, albumName);
    }

    joinRoom(username: string, collaborationRoomId: number): void {
        console.log('we want to join this, ', collaborationRoomId);
        this.currentCollabRoom = collaborationRoomId;
        this.socket.emit('join collab Room', username, collaborationRoomId);
    }

    sendMvt(mvt: Movement): void {
        console.log('current collab is', this.currentCollabRoom);
        this.socket.emit('update drawing', this.currentCollabRoom, mvt);
    }
    leaveCollabRoom(username: string): void {
        console.log('to leave this', this.currentCollabRoom);
        this.socket.emit('leave collab', this.currentCollabRoom, username);
        this.currentCollabRoom = -1;
    }
    createChat(chatname: string, username: string) {
        this.socket.emit('create Chat room', username, chatname);
    }
    joinChat(username: string, chatIndex: number) {
        this.currentChatRoom = chatIndex;
        this.socket.emit('join chat Room', username, chatIndex);
    }
    leaveChatRoom(username: string): void {
        this.socket.emit('leave chat', this.currentChatRoom, username);
        this.currentChatRoom = -1;
    }
}
