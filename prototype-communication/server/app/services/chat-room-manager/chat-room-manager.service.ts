import { ChatRoom } from '@app/classes/chat-room/chat-room';
import { Service } from 'typedi';

@Service()
export class ChatRoomManager {
    rooms: ChatRoom[];
    currentRoomID: number;

    constructor() {
        this.rooms = new Array<ChatRoom>();
        this.currentRoomID = this.rooms.length;
    }

    findRoom(roomId: number): ChatRoom {
        const aRooms: ChatRoom[] = this.rooms.filter((el) => {
            return el.chatRoomId === roomId;
        });

        if (aRooms.length > 0) {
            const room = aRooms[0];
            return room;
        }

        return aRooms[0];
    }

    addRoom(roomType: number): ChatRoom {
        this.currentRoomID = this.rooms.length;
        const room: ChatRoom = new ChatRoom();
        this.rooms.push(room);
        return room;
    }
}
