import { SelectionManager } from '@app/classes/selection/selection-manager';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionButtonPosition, SelectionState, SELECTION_BEGINNING_WAIT_KEYBAORD } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';

export class FinalizedSelection extends Selection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    async onMouseUp(event: MouseEvent): Promise<void> {
        const insideSelection = event.target instanceof HTMLDivElement && event.target.className === 'selection-rectangle';
        const overSidebar = this.selectionService.getPositionFromMouse(event)?.x < 0;
        if (insideSelection || overSidebar) return;

        this.selectionService.finishDrawing();
    }

    finishDrawing(): void {
        this.selectionService.selectionState = SelectionState.Nothing;
        this.selectionManager.updateView();
        this.selectionManager.draw(true, this.selectionService.toolActionData, true);
    }

    updateView(): void {
        this.selectionManager.draw(false, this.selectionService.toolActionData);
        this.selectionManager.drawPerimiter();
    }

    onMouseDown(event: MouseEvent, isOverSelection: boolean, isOverButton: boolean = false, button?: SelectionButtonPosition): void {
        if (isOverButton && button !== undefined) {
            this.selectionService.selectionState = SelectionState.ResizingSelection;
            this.selectionService.initialPositionBeforeMove = this.selectionService.buttonPos[button];
            this.selectionService.initialWidthBeforeReize = this.selectionService.toolActionData.newSelectionWidth;
            this.selectionService.initialHeightBeforeReize = this.selectionService.toolActionData.newSelectionHeight;
            this.selectionService.mouseDownPosition = this.selectionService.mousePosition = this.selectionService.getPositionFromMouse(event);
            this.selectionService.buttonCurrentlyMoving = button;
        } else if (isOverSelection) {
            this.selectionService.selectionState = SelectionState.MovingSelectionMouse;
            this.selectionService.initialPositionBeforeMove = this.selectionService.topLeftCorner;
            this.selectionService.mouseDownPosition = this.selectionService.mousePosition = this.selectionService.getPositionFromMouse(event);
        } else {
            this.selectionService.finishDrawing();
            this.selectionService.selectionState = SelectionState.DrawingSelectionBox;
            this.selectionService.mouseDownPosition = this.selectionService.mousePosition = this.selectionService.getPositionFromMouse(event);
        }
    }

    moveDrawingWithKeyboard(): void {
        this.selectionService.selectionState = SelectionState.WaitingToMoveSelectionKeyboard;
        this.selectionService.intervalRef = setInterval(() => {
            if (this.selectionService.selectionState === SelectionState.WaitingToMoveSelectionKeyboard)
                this.selectionService.selectionState = SelectionState.MovingSelectionKeyboard;
        }, SELECTION_BEGINNING_WAIT_KEYBAORD);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (event.key !== KeyboardButton.Escape) return;
        this.selectionService.finishDrawing();
    }
}
