import { SelectionManager } from '@app/classes/selection/selection-manager';
import { Vec2 } from '@app/classes/vec2';
import { SelectionButtonPosition, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';

export class ResizingSelection extends Selection {
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

    private resizeDrawing(): void {
        const newWidthLeft =
            this.selectionService.initialWidthBeforeReize + this.selectionService.initialPositionBeforeMove.x - this.selectionService.mousePosition.x;

        const newWidthRight =
            this.selectionService.initialWidthBeforeReize + this.selectionService.mousePosition.x - this.selectionService.initialPositionBeforeMove.x;

        const newHeightBottom =
            this.selectionService.initialHeightBeforeReize +
            this.selectionService.mousePosition.y -
            this.selectionService.initialPositionBeforeMove.y;

        const newHeightTop =
            this.selectionService.initialHeightBeforeReize +
            this.selectionService.initialPositionBeforeMove.y -
            this.selectionService.mousePosition.y;

        const mousePosition = new Vec2(this.selectionService.mousePosition);
        const oldTopLeftCorner = new Vec2(this.selectionService.topLeftCorner.x, this.selectionService.topLeftCorner.y);

        const widthScaleFromLeft =
            (this.selectionService.mouseDownPosition.x + this.selectionService.initialWidthBeforeReize - this.selectionService.mousePosition.x) /
            Math.abs(
                this.selectionService.mouseDownPosition.x + this.selectionService.initialWidthBeforeReize - this.selectionService.mousePosition.x,
            );
        const widthScaleFromRight =
            -(this.selectionService.mouseDownPosition.x - this.selectionService.initialWidthBeforeReize - this.selectionService.mousePosition.x) /
            Math.abs(
                this.selectionService.mouseDownPosition.x - this.selectionService.initialWidthBeforeReize - this.selectionService.mousePosition.x,
            );

        const heightScaleFromTop =
            (this.selectionService.mouseDownPosition.y + this.selectionService.initialHeightBeforeReize - this.selectionService.mousePosition.y) /
            Math.abs(
                this.selectionService.mouseDownPosition.y + this.selectionService.initialHeightBeforeReize - this.selectionService.mousePosition.y,
            );
        const heightScaleFromBottom =
            -(this.selectionService.mouseDownPosition.y - this.selectionService.initialHeightBeforeReize - this.selectionService.mousePosition.y) /
            Math.abs(
                this.selectionService.mouseDownPosition.y - this.selectionService.initialHeightBeforeReize - this.selectionService.mousePosition.y,
            );

        switch (this.selectionService.buttonCurrentlyMoving) {
            case SelectionButtonPosition.TopLeft:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(mousePosition);
                this.selectionService.toolActionData.newSelectionWidth = newWidthLeft;
                this.selectionService.toolActionData.newSelectionHeight = newHeightTop;
                this.selectionService.toolActionData.widthScale = widthScaleFromLeft;
                this.selectionService.toolActionData.heightScale = heightScaleFromTop;
                break;

            case SelectionButtonPosition.TopMiddle:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(oldTopLeftCorner.x, mousePosition.y);
                this.selectionService.toolActionData.newSelectionHeight = newHeightTop;
                this.selectionService.toolActionData.heightScale = heightScaleFromTop;
                break;

            case SelectionButtonPosition.TopRight:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(oldTopLeftCorner.x, mousePosition.y);
                this.selectionService.toolActionData.newSelectionWidth = newWidthRight;
                this.selectionService.toolActionData.newSelectionHeight = newHeightTop;
                this.selectionService.toolActionData.heightScale = heightScaleFromTop;
                this.selectionService.toolActionData.widthScale = widthScaleFromRight;
                break;

            case SelectionButtonPosition.MiddleLeft:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(mousePosition.x, oldTopLeftCorner.y);
                this.selectionService.toolActionData.newSelectionWidth = newWidthLeft;
                this.selectionService.toolActionData.widthScale = widthScaleFromLeft;
                break;

            case SelectionButtonPosition.MiddleRight:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(oldTopLeftCorner);
                this.selectionService.toolActionData.newSelectionWidth = newWidthRight;
                this.selectionService.toolActionData.widthScale = widthScaleFromRight;
                break;

            case SelectionButtonPosition.BottomLeft:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(mousePosition.x, oldTopLeftCorner.y);
                this.selectionService.toolActionData.newSelectionWidth = newWidthLeft;
                this.selectionService.toolActionData.newSelectionHeight = newHeightBottom;
                this.selectionService.toolActionData.widthScale = widthScaleFromLeft;
                this.selectionService.toolActionData.heightScale = heightScaleFromBottom;
                break;

            case SelectionButtonPosition.BottomMiddle:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(oldTopLeftCorner);
                this.selectionService.toolActionData.newSelectionHeight = newHeightBottom;
                this.selectionService.toolActionData.heightScale = heightScaleFromBottom;
                break;

            case SelectionButtonPosition.BottomRight:
                this.selectionService.toolActionData.newSelectionTopLeftCorner = new Vec2(oldTopLeftCorner);
                this.selectionService.toolActionData.newSelectionWidth = newWidthRight;
                this.selectionService.toolActionData.newSelectionHeight = newHeightBottom;
                this.selectionService.toolActionData.widthScale = widthScaleFromRight;
                this.selectionService.toolActionData.heightScale = heightScaleFromBottom;
                break;
        }
    }

    updateView(): void {
        this.resizeDrawing();
        if (this.selectionService.shiftDown) {
            this.selectionService.toolActionData.newSelectionWidth = this.selectionService.toolActionData.newSelectionHeight = Math.min(
                this.selectionService.toolActionData.newSelectionWidth,
                this.selectionService.toolActionData.newSelectionHeight,
            );
        }
        this.selectionService.updateControlPointsPositions();
        this.selectionManager.draw(false, this.selectionService.toolActionData);
        this.selectionManager.drawPerimiter();
    }
}
