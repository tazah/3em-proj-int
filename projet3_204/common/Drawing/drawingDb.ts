import { Movement } from '../classes/movement';

export interface LightDrawing {
    drawingId?: string;
    drawingName: string;
    owner: string;
    dateOfCreation: string;
    socketIndex: number;
}

export interface DrawingDb extends LightDrawing {
    allMouvements: Movement[];
}
