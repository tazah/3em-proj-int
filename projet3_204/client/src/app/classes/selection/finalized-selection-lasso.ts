import { SelectionManager } from '@app/classes/selection/selection-manager';
import { SelectionButtonPosition, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { FinalizedSelection } from './finalized-selection';

export class FinalizedSelectionLasso extends FinalizedSelection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    onMouseDown(event: MouseEvent, isOverSelection: boolean, isOverButton: boolean = false, button?: SelectionButtonPosition): void {
        if (isOverButton && button !== undefined) {
            this.selectionService.selectionState = SelectionState.ResizingSelection;
            this.selectionService.initialPositionBeforeMove = this.selectionService.buttonPos[button];
            this.selectionService.initialWidthBeforeReize = this.selectionService.toolActionData.newSelectionWidth;
            this.selectionService.initialHeightBeforeReize = this.selectionService.toolActionData.newSelectionHeight;
            this.selectionService.mouseDownPosition = this.selectionService.mousePosition = this.selectionService.getPositionFromMouse(event);
            this.selectionService.buttonCurrentlyMoving = button;
        } else if (!isOverSelection) return;
        else {
            this.selectionService.selectionState = SelectionState.MovingSelectionMouse;
            this.selectionService.initialPositionBeforeMove = this.selectionService.topLeftCorner;
            this.selectionService.mouseDownPosition = this.selectionService.mousePosition = this.selectionService.getPositionFromMouse(event);
        }
    }

    async onMouseUp(event: MouseEvent): Promise<void> {
        // it is be taken care of in onClick
    }

    async onClick(event: MouseEvent): Promise<void> {
        return super.onMouseUp(event);
    }
}
