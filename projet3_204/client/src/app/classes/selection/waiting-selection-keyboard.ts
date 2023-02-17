import { SelectionManager } from '@app/classes/selection/selection-manager';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';

export class WaitingForSelectionByKeyboard extends Selection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    stopMoveDrawingWithKeyboard(): void {
        this.selectionService.selectionState = SelectionState.SomethingHasBeenSelected;
        this.selectionManager.updateView();
        if (this.selectionService.intervalRef) window.clearInterval(this.selectionService.intervalRef);
    }
}
