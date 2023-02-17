import { CollaborationRoom } from '@app/classes/collaboration-room/collaboration-room';
import { Service } from 'typedi';

@Service()
export class CollaborationRoomManager {
    rooms: CollaborationRoom[];
    currentRoomID: number;

    constructor() {
        this.rooms = new Array<CollaborationRoom>();
        this.currentRoomID = this.rooms.length;
    }

    findRoom(roomId: number): CollaborationRoom {
        const aRooms: CollaborationRoom[] = this.rooms.filter((el) => {
            return el.collaborationRoomId === roomId;
        });

        if (aRooms.length > 0) {
            const room = aRooms[0];
            return room;
        }

        return aRooms[0];
    }

    addRoom(roomType: number): CollaborationRoom {
        this.currentRoomID = this.rooms.length;
        const room: CollaborationRoom = {
            collaborationRoomId: this.rooms.length,
            members: [],
            movements: [],
            isFull: false,
            creator: '',
        };
        this.rooms.push(room);
        return room;
    }
}
