import { Movement } from '../../../../../common/classes/movement';

export interface LightDrawing {
    drawingId?: string;
    drawingName?: string;
    owner?: string;
    dateOfCreation?: string;
    socketIndex?: number;
}

export interface Drawing extends LightDrawing {
    allMouvements?: Movement[];
}
