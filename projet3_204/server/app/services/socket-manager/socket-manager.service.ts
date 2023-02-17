import { CollaborationRoom } from '@app/classes/collaboration-room/collaboration-room';
import { Drawing } from '@app/classes/interfaces/drawing/drawing';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { Chat } from './../../../../common/chat/chat';
import { COLLAB, DEACTIVATE, HELP, INFO, PROFILE, TOOLS } from './../../../../common/chatBot/chatBot';
import { Movement } from './../../../../common/classes/movement';
import { Message } from './../../../../common/Message/message';
import { ChatCollectionService } from './../chat/chat-collection.service';
import { DatabaseConnectionService } from './../database-connection/connection.service';
@Service()
export class SocketManager {
    private sio: io.Server;
    private collaborationRooms: CollaborationRoom[];
    private chatRooms: Chat[];
    private chatCollectionService: ChatCollectionService;

    constructor(httpServer: http.Server, public database: DatabaseConnectionService) {
        this.sio = new io.Server(httpServer, { cors: { origin: '*' } });
        this.collaborationRooms = [];
        this.chatCollectionService = new ChatCollectionService(this.database);
        this.chatRooms = [];
        this.createFirstPublicChat();
    }

    async createFirstPublicChat() {
        const publicChat: Chat[] = await this.chatCollectionService.getPublicChat();
        this.chatRooms.push(publicChat[0]);
    }
    async loadChatFromBd() {
        const chats: Chat[] = await this.chatCollectionService.getAllChats();
        this.chatRooms = chats;
    }

    async loadDrawingFromDb() {
        const drawings: Drawing[] = await this.database.getAllDrawings();
        console.log('drawing', drawings);

        drawings.forEach((element) => {
            const collabRomElement: CollaborationRoom = {
                collaborationRoomId: element.socketIndex as number,
                creator: element.owner as string,
                members: [],
                isFull: false,
                movements: element.allMouvements as Movement[],
            };
            this.collaborationRooms.push(collabRomElement);
        });
    }

    handleSockets(): void {
        this.loadDrawingFromDb();
        this.loadChatFromBd();
        this.sio.on('connection', (socket) => {
            socket.join('0chat');
            socket.on('onSendMessage', (message: string, sender: string, chatRoomIndex: number) => {
                console.log('WE ARE IN CHATROOM', chatRoomIndex);
                if (this.verifyMessage(message)) {
                    console.log('this is received message', message);
                    socket.join(chatRoomIndex.toString() + 'chat');
                    let time: String = new Date().toLocaleTimeString();
                    if (message === HELP) {
                        this.chatRooms[chatRoomIndex].isBotActive = true;
                    }
                    const ogSender = sender;
                    if (this.chatRooms[chatRoomIndex].isBotActive) {
                        sender = 'Bot';
                        switch (message) {
                            case TOOLS:
                                message = 'tool';
                                break;
                            case INFO:
                                message = 'info';
                                break;
                            case COLLAB:
                                message = 'co';
                                break;
                            case PROFILE:
                                message = 'profile';
                                break;
                            case HELP:
                                message = 'Bot est maintenant activé!';
                                break;
                            case DEACTIVATE:
                                message = 'Bot est déactivé! Bye!!';
                                this.chatRooms[chatRoomIndex].isBotActive = false;
                                break;
                            default:
                                if (message[0] === '#') {
                                    message = 'le message nest pas une commande de bot valide. Veuillez entrez une commande valide';
                                } else {
                                    sender = ogSender;
                                }

                                break;
                        }
                    } else {
                        if (message[0] === '#' && !this.chatRooms[chatRoomIndex].isBotActive) {
                            sender = 'Bot';
                            message = 'Le bot nest pas activé. Il faut lactiver avec la commande #aide';
                        }
                    }

                    const messageToSend: Message = {
                        message,
                        sender,
                        time: time.toString(),
                    };

                    this.chatCollectionService.addNewMessageByChatIndex(chatRoomIndex, messageToSend);

                    socket.in(chatRoomIndex.toString() + 'chat').emit('receiveMessage', message, time, sender);
                    socket.emit('receiveMessage', message, time, sender);
                }
            });
            socket.on('create Collaboration Room', (playerPseudonym: string, drawing, albumName: string) => {
                const collabRoom: CollaborationRoom = {
                    creator: playerPseudonym,
                    members: [playerPseudonym],
                    collaborationRoomId: this.collaborationRooms.length,
                    isFull: false,
                    movements: [],
                };
                this.collaborationRooms.push(collabRoom);
                console.log('vdzgbs', this.collaborationRooms);
                socket.join(collabRoom.collaborationRoomId.toString());
                const tDrawing: Drawing = JSON.parse(drawing);
                tDrawing.socketIndex = collabRoom.collaborationRoomId;
                this.database.addNewDrawing(tDrawing, albumName);
                console.log('before join');
                socket.emit('sucess join', collabRoom.collaborationRoomId);
            });

            socket.on('available collab rooms', () => {
                let availableRooms: CollaborationRoom[] = new Array<CollaborationRoom>();
                availableRooms = this.collaborationRooms.filter((aRoom) => aRoom.isFull === false);
                socket.emit('collect available collab rooms', availableRooms);
                return availableRooms;
            });

            socket.on('join collab Room', (playerPseudonym: string, collaborationRoomId: number) => {
                if (collaborationRoomId > this.collaborationRooms.length || this.collaborationRooms[collaborationRoomId].isFull) {
                    socket.emit('wrong selection');
                    return;
                }
                socket.join(collaborationRoomId.toString());
                let previousMovements: Movement[] = [];
                this.database.getDrawingBySocketIndex(collaborationRoomId).then((res: Drawing[]) => {
                    // previousMovements= res[0].allMouvements;
                });
                this.collaborationRooms[collaborationRoomId].members.push(playerPseudonym);
                console.log('le tableau est ', this.collaborationRooms);
                socket.emit('sucess join', collaborationRoomId, previousMovements);
            });
            socket.on('update drawing', (collaborationRoomId: number, movement: Movement) => {
                console.log('cococdoocs', collaborationRoomId);
                this.collaborationRooms[collaborationRoomId].movements.push(movement);
                console.log('le movement est ', movement);
                //this.sio.in(collaborationRoomId.toString()).emit('new update', movement);
                //Emit to everyone on collaboration room except the sender this.sio.in --> socket.in
                this.database.addMovementToDrawing(collaborationRoomId, this.collaborationRooms[collaborationRoomId].movements);
                //this.sio.in(collaborationRoomId.toString()).emit('new update', movement);
                socket.in(collaborationRoomId.toString()).emit('new update', movement);
            });
            socket.on('leave collab', (collabRoomIndex: number, pseudonyme: string) => {
                socket.leave(collabRoomIndex.toString());
                if (this.collaborationRooms.length < collabRoomIndex) {
                    return;
                }
                let position = this.collaborationRooms[collabRoomIndex].members.indexOf(pseudonyme);
                if (position == -1) {
                    return;
                }
                this.collaborationRooms[collabRoomIndex].members.splice(position, 1);
                this.collaborationRooms[collabRoomIndex].isFull = this.collaborationRooms[collabRoomIndex].members.length >= 4;
            });
            socket.on('create Chat room', (username: string, chatname: string) => {
                const chatToAdd: Chat = {
                    chatIndex: this.chatRooms.length,
                    chatName: chatname,
                    chatCreator: username,
                    messages: [],
                    public: false,
                    members: [username],
                    isBotActive: false,
                };
                this.chatRooms.push(chatToAdd);
                socket.join(chatToAdd.chatIndex?.toString + 'chat');
                this.chatCollectionService.addNewChat(chatToAdd);
                socket.emit('sucess join chat', chatToAdd.chatIndex, []);
            });
            socket.on('join chat Room', async (playerPseudonym: string, chatRoomId: number) => {
                if (chatRoomId > this.chatRooms.length) {
                    socket.emit('wrong selection');
                    return;
                }
                socket.join(chatRoomId.toString() + 'chat');
                let chatToGet: Chat[] = [];
                await this.chatCollectionService.getChatBySocketIndex(chatRoomId).then((res: Chat[]) => {
                    chatToGet = res;
                });
                this.chatRooms[chatRoomId].members?.push(playerPseudonym);
                // add to members in bd as well
                this.chatCollectionService.addNewMember(playerPseudonym, chatToGet[0]?.chatIndex as number);
                console.log('*** CHAT TO GET ***', chatToGet[0]);
                socket.emit('sucess join chat', chatRoomId, chatToGet[0].messages);
            });
            socket.on('leave chat', (chatRoomId: number, pseudonyme: string) => {
                socket.leave(chatRoomId.toString() + 'chat');
                if (this.chatRooms.length < chatRoomId) {
                    return;
                }
                let position = this.chatRooms[chatRoomId].members?.indexOf(pseudonyme);
                if (position == -1) {
                    return;
                }
                this.chatRooms[chatRoomId].members?.splice(position as number, 1);

                console.log('MESSAGE PERTINENT');
            });
        });
    }

    verifyMessage(msg: string): Boolean {
        if (msg.length == 0) {
            return false;
        } else if (msg.trim().length == 0) {
            return false;
        } else {
            return true;
        }
    }
}
