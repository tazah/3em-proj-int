import { SelectionManager } from '@app/classes/selection/selection-manager';
import { SelectionButtonPosition } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable: no-empty <- Justified as this is an abstract class
export abstract class Selection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {}
    onMouseMove(event: MouseEvent): void {}
    onMouseDown(event: MouseEvent, isOverSelection: boolean = false, isOverButton: boolean = false, button?: SelectionButtonPosition): void {}
    async onMouseUp(event: MouseEvent): Promise<void> {}
    updateView(): void {}
    moveDrawingWithKeyboard(): void {}
    stopMoveDrawingWithKeyboard(): void {}
    async onClick(event: MouseEvent): Promise<void> {}
    onKeyUp(event: KeyboardEvent): void {}
    finishDrawing(): void {}
}
