import { Injectable } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { UserAuthentificationService } from '../authentification/UserAuthentification.service';
import { ChatCommunicationService } from '../chat/chat-communication.service';

@Injectable({
    providedIn: 'root',
})
export class MouseService extends Tool {
    constructor(
        drawingService: DrawingService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
    }
}
