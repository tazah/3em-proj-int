import { SelectionManager } from '@app/classes/selection/selection-manager';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { NothingSelection } from './nothing-selection';

export class NothingSelectionLasso extends NothingSelection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    onMouseDown(event: MouseEvent, isOverSelection: boolean = false): void {
        // Will use onClick instead
    }

    async onClick(event: MouseEvent): Promise<void> {
        super.onMouseDown(event);
        this.selectionService.toolActionData.pathData.push(this.selectionService.mousePosition);
    }
}
