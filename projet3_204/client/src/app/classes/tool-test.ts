import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ToolActionData } from './actions/tool-action-data';
import { Tool } from './tool';

export class ToolActionDataTest extends ToolActionData {}

// tslint:disable-next-line: max-classes-per-file
export class ToolTest extends Tool {
    constructor(drawingService: DrawingService, colorService: ColorService, protected undoRedoService: UndoRedoService) {
        super(drawingService, colorService, undoRedoService);
    }
}
