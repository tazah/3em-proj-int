import { Movement } from '../../../../common/classes/movement';

export class CollaborationRoom {
    collaborationRoomId: number;
    creator: string;
    members: string[];
    isFull: boolean;
    movements: Movement[];
}
