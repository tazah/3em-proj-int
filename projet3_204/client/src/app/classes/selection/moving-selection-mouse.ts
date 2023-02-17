import { SelectionManager } from '@app/classes/selection/selection-manager';
import { Vec2 } from '@app/classes/vec2';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';

export class MovingSelectionByMouse extends Selection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    async onMouseUp(event: MouseEvent): Promise<void> {
        this.selectionService.selectionState = SelectionState.SomethingHasBeenSelected;
        this.selectionManager.updateView();
    }

    onMouseMove(event: MouseEvent): void {
        this.selectionService.mousePosition = this.selectionService.getPositionFromMouse(event);
        this.selectionManager.updateView();
    }

    updateView(): void {
        this.selectionService.topLeftCorner = this.updateTranslation();
        this.selectionService.updateControlPointsPositions();
        this.selectionManager.draw(false, this.selectionService.toolActionData);
        this.selectionManager.drawPerimiter();
    }

    private updateTranslation(): Vec2 {
        const move = new Vec2(
            this.selectionService.initialPositionBeforeMove.x - this.selectionService.mouseDownPosition.x + this.selectionService.mousePosition.x,
            this.selectionService.initialPositionBeforeMove.y - this.selectionService.mouseDownPosition.y + this.selectionService.mousePosition.y,
        );
        return move;
    }
}
