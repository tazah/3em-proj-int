import { SelectionManager } from '@app/classes/selection/selection-manager';
import { Vec2 } from '@app/classes/vec2';
import { BLACK } from '@app/constants/color.constants';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { MINIMUM_POINTS_SELECTION_LASSO, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PrototypeSelection } from './prototype-selection';

export class PrototypeSelectionLasso extends PrototypeSelection {
    constructor(
        protected selectionService: SelectionService,
        protected drawingService: DrawingService,
        protected undoRedoService: UndoRedoService,
        protected selectionManager: SelectionManager,
    ) {
        super(selectionService, drawingService, undoRedoService, selectionManager);
    }

    async onMouseUp(event: MouseEvent): Promise<void> {
        // Don't do anything routed event to onClick instead
    }

    async onClick(event: MouseEvent): Promise<void> {
        if (this.pathData.length === 0) {
            this.selectionService.selectionState = SelectionState.Nothing;
            return;
        }
        if (this.selectionService.isOutsideCanvas) return;
        this.mousePosition = this.selectionService.getPositionFromMouse(event);
        const shiftMousePosition = LineService.calculatePointWithAngle(this.mousePosition, this.pathData[this.pathData.length - 1]);
        if (
            (this.intersects(this.mousePosition) && !this.selectionService.shiftDown) ||
            (this.intersects(shiftMousePosition) && this.selectionService.shiftDown)
        )
            return;
        if (this.pathData.length >= MINIMUM_POINTS_SELECTION_LASSO && this.pathIsClosed()) {
            this.pathData.push(this.pathData[0]);
            this.selectionManager.updateShapeDataResizing();
            this.selectionService.selectionState = SelectionState.SomethingHasBeenSelected;
            this.selectionService.toolActionData.heightScale = 1;
            this.selectionService.toolActionData.widthScale = 1;
            this.selectionService.toolActionData.shouldFillOriginalWhite = true;
            await this.selectionManager.getImageData();
        } else if (this.selectionService.shiftDown) {
            this.mousePosition = shiftMousePosition;
            this.pathData.push(this.mousePosition);
        } else {
            this.pathData.push(this.mousePosition);
        }
        this.selectionManager.updateView();
    }

    onMouseMove(event: MouseEvent): void {
        if (this.pathData.length === 0) {
            this.selectionService.selectionState = SelectionState.Nothing;
            return;
        }
        this.mousePosition = this.selectionService.getPositionFromMouse(event);
        const shiftMousePosition = LineService.calculatePointWithAngle(this.mousePosition, this.pathData[this.pathData.length - 1]);
        if (
            (this.intersects(this.mousePosition) && !this.selectionService.shiftDown) ||
            (this.intersects(shiftMousePosition) && this.selectionService.shiftDown)
        ) {
            this.selectionManager.updateView();
            this.drawErrorCursor();
            return;
        } else if (this.selectionService.shiftDown) {
            this.mousePosition = shiftMousePosition;
        }
        this.selectionManager.updateView();
    }

    onMouseDown(event: MouseEvent): void {
        this.selectionManager.updateView();
    }

    updateView(): void {
        const ctx = this.drawingService.selectionBoxCtx;
        this.drawingService.clearCanvas(ctx);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (const point of this.pathData) ctx.lineTo(point.x, point.y);
        ctx.lineTo(this.mousePosition.x, this.mousePosition.y);
        ctx.stroke();
        ctx.closePath();
    }

    private drawErrorCursor(): void {
        const ctx = this.drawingService.selectionBoxCtx;
        ctx.fillStyle = 'red';
        ctx.font = '30px sans-serif';
        ctx.fillText('❌', this.mousePosition.x, this.mousePosition.y);
    }

    private pathIsClosed(): boolean {
        const distanceFromInitialPoint = 20;
        return (
            Math.abs(this.mousePosition.x - this.pathData[0].x) <= distanceFromInitialPoint &&
            Math.abs(this.mousePosition.y - this.pathData[0].y) <= distanceFromInitialPoint
        );
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButton.Backspace:
                this.pathData.pop();
                this.selectionManager.updateView();
                break;

            case KeyboardButton.Escape:
                this.selectionService.selectionState = SelectionState.Nothing;
                this.selectionService.toolActionData.pathData = [];
                this.selectionManager.updateView();
                break;
        }
    }

    // Inspired from : https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
    private intersects(nxtPt: Vec2): boolean {
        if (this.pathData.length < MINIMUM_POINTS_SELECTION_LASSO) {
            return false;
        }

        const p = this.pathData[this.pathData.length - 1].x;
        const q = this.pathData[this.pathData.length - 1].y;
        const r = nxtPt.x;
        const s = nxtPt.y;

        for (let i = 0; i < this.pathData.length - 2; i++) {
            const a = this.pathData[i].x;
            const b = this.pathData[i].y;
            const c = this.pathData[i + 1].x;
            const d = this.pathData[i + 1].y;
            const det = (c - a) * (s - q) - (r - p) * (d - b);
            const lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
            const gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
            if (det !== 0 && 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1) {
                return true;
            }
        }
        return false;
    }

    get pathData(): Vec2[] {
        return this.selectionService.toolActionData.pathData;
    }

    get mousePosition(): Vec2 {
        return this.selectionService.mousePosition;
    }

    set mousePosition(value: Vec2) {
        this.selectionService.mousePosition = value;
    }
}
