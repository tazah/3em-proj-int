import { SelectionManager } from '@app/classes/selection/selection-manager';
import { Vec2 } from '@app/classes/vec2';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';

export class PrototypeSelection extends Selection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    async onMouseUp(event: MouseEvent): Promise<void> {
        if (this.selectionService.mouseDownPosition.equals(this.selectionService.mousePosition)) {
            this.selectionService.selectionState = SelectionState.Nothing;
            this.selectionManager.updateView();
        } else {
            this.selectionService.selectionState = SelectionState.SomethingHasBeenSelected;
            this.selectionService.toolActionData.widthScale = 1;
            this.selectionService.toolActionData.heightScale = 1;
            this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(this.selectionService.toolActionData.oldSelectionTopLeftCorner);
            this.selectionService.toolActionData.newSelectionWidth = this.selectionService.toolActionData.oldSelectionWidth;
            this.selectionService.toolActionData.newSelectionHeight = this.selectionService.toolActionData.oldSelectionHeight;
            this.selectionService.toolActionData.shouldFillOriginalWhite = true;
            await this.selectionManager.getImageData();
            this.selectionManager.updateView();
        }
    }

    onMouseMove(event: MouseEvent): void {
        const newMousePosition = this.selectionService.getPositionFromMouse(event);
        if (this.selectionService.isOutsideCanvas) {
            this.selectionService.mousePosition = this.calculateIntersectionPoint(newMousePosition);
        } else {
            this.selectionService.mousePosition = newMousePosition;
        }
        this.selectionManager.updateView();
    }

    updateView(): void {
        this.selectionManager.updateShapeDataResizing();
        this.selectionManager.drawPerimiter();
    }

    private calculateIntersectionPoint(outsidePoint: Vec2): Vec2 {
        const mousePosition = new Vec2(outsidePoint);
        if (mousePosition.x > this.drawingService.canvas.width) mousePosition.x = this.drawingService.canvas.width;
        if (mousePosition.y > this.drawingService.canvas.height) mousePosition.y = this.drawingService.canvas.height;
        return mousePosition;
    }
}
