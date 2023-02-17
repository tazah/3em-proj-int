import { SelectionManager } from '@app/classes/selection/selection-manager';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState, SELECTION_KEYBOARD_MOVE_DISTANCE } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';

export class MovingSelectionByKeyboard extends Selection {
    private firstKeyBoardMove: boolean = true;

    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    updateView(): void {
        this.selectionService.updateControlPointsPositions();
        this.selectionManager.draw(false, this.selectionService.toolActionData);
        this.selectionManager.drawPerimiter();
    }

    moveDrawingWithKeyboard(): void {
        const translation = this.setTranslation();

        if (this.selectionService.arrowsPressed.get(KeyboardButton.ArrowLeft)) this.selectionService.topLeftCorner.x -= translation;
        if (this.selectionService.arrowsPressed.get(KeyboardButton.ArrowRight)) this.selectionService.topLeftCorner.x += translation;
        if (this.selectionService.arrowsPressed.get(KeyboardButton.ArrowUp)) this.selectionService.topLeftCorner.y -= translation;
        if (this.selectionService.arrowsPressed.get(KeyboardButton.ArrowDown)) this.selectionService.topLeftCorner.y += translation;

        this.selectionManager.updateView();
    }

    stopMoveDrawingWithKeyboard(): void {
        this.selectionService.selectionState = SelectionState.SomethingHasBeenSelected;
        this.selectionManager.updateView();
        if (this.selectionService.intervalRef) window.clearInterval(this.selectionService.intervalRef);
    }

    resetKeyBoardMove(): void {
        if (!this.firstKeyBoardMove) this.firstKeyBoardMove = true;
    }

    private setTranslation(): number {
        return SELECTION_KEYBOARD_MOVE_DISTANCE;
    }
}
