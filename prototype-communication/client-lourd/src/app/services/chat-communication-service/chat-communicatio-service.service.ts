import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Message } from '../../../../../common/Message/message';

@Injectable({
    providedIn: 'root',
})
export class ChatCommunicatioService {
    chatHistory : Message[];
    socket: io.Socket;
    username: String;
    initFalg : Boolean =  false;
    private readonly hostName: string='http://ec2-3-98-94-239.ca-central-1.compute.amazonaws.com:3000/';

    constructor() {
      this.chatHistory = [];

      this.socket = io.connect(this.hostName, { transports: ["websocket"] })
    }

    socketInit(): void {
        if(!this.initFalg){
            this.initFalg = true;


        this.socket.on('receiveMessage', (message:string,time:string,sender:string) => {
          let msg:Message={message, time, sender};

          this.chatHistory.push(msg);

        });
    }

      }

    sendMessage(message : string,sender:string){
      this.socket.emit('onSendMessage',message,sender);
    }




}
