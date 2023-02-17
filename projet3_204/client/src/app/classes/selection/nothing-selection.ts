import { SelectionManager } from '@app/classes/selection/selection-manager';
import { Vec2 } from '@app/classes/vec2';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';

export class NothingSelection extends Selection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    onMouseDown(event: MouseEvent, isOverSelection: boolean = false): void {
        this.selectionService.selectionState = SelectionState.DrawingSelectionBox;
        this.selectionService.mouseDownPosition = this.selectionService.getPositionFromMouse(event);
        this.selectionService.mousePosition = new Vec2(this.selectionService.mouseDownPosition);
    }
}
