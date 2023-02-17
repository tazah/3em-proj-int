import { Injectable } from '@angular/core';
//import { Router } from '@angular/router';
//import { Room } from '@app/classes/room/room';
//import { LocalGameHandlerService } from '@app/services/local-game-handler/local-game-handler.service';
import { User } from './../../../../../common/user/user';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ChatCommunicatioService {
    chatHistory : string[];
    socket: io.Socket;
    user: User;
    private readonly hostName: string;

    constructor() {
      this.chatHistory = [];
      this.hostName = environment.socketUrl;
      this.socket = io.connect(this.hostName, { forceNew: true });
       
    }

    socketInit(): void {
        this.socket.on('clickBtn', () => {
          console.log('dis is room');
        });
        this.socket.on('receive', (message:string) => {
          this.chatHistory.push(message);
        });
      }

    btnClick(){
      this.socket.emit('btnbtn');
      console.log('test');
    }
    sendMessage(message : string){
      this.chatHistory.push(message);
      this.socket.emit('send message', message);
    }

   

   
}
