
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';


//import { User } from './../../../../common/user/user';

@Service()
export class SocketManager {
    private sio: io.Server;

    constructor(httpServer: http.Server) {
        this.sio = new io.Server(httpServer, { cors: { origin: '*' } });

    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {

            socket.on('onSendMessage', (message:string,sender:string) => {
                if(this.verifyMessage(message))
                {
                    console.log("message size",message.trim().length);
                    let time:String= new Date().toLocaleTimeString();
                    console.log('Message recieved :',message);
                    console.log('time :',time);
                    this.sio.emit("receiveMessage",message,time,sender);
                }
            });

        });
    }

    verifyMessage(msg:string): Boolean{
        if(msg.length==0){
            return false;
        }
        else if(msg.trim().length==0){
            return false;
        }
        else{
            return true;
        }
    }












}
