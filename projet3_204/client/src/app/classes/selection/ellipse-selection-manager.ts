import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { ToolAction } from '@app/classes/actions/tool-action';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionManager } from './selection-manager';

export class EllipseSelectionManager extends SelectionManager {
    constructor(protected selectionService: SelectionService, protected drawingService: DrawingService, protected undoRedoService: UndoRedoService) {
        super(selectionService, drawingService, undoRedoService);
    }

    drawPerimiter(): void {
        this.drawingService.selectionBoxCtx.save();
        super.drawPerimiter();
        const radius: Vec2 = new Vec2(Math.abs(this.selectionService.width / 2), Math.abs(this.selectionService.height / 2));
        this.drawingService.selectionBoxCtx.beginPath();
        this.drawingService.selectionBoxCtx.ellipse(
            this.selectionService.topLeftCorner.x + this.selectionService.width / 2,
            this.selectionService.topLeftCorner.y + this.selectionService.height / 2,
            radius.x,
            radius.y,
            0,
            0,
            2 * Math.PI,
        );
        this.drawingService.selectionBoxCtx.stroke();
        this.drawingService.selectionBoxCtx.restore();
    }

    draw(drawToBaseCanvas: boolean, actionData: SelectionActionData, recordAction?: boolean): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const ctx = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        if (actionData.oldSelectionHeight < 2) actionData.oldSelectionHeight = 2;
        if (actionData.oldSelectionWidth < 2) actionData.oldSelectionWidth = 2;
        if (actionData.shouldFillOriginalWhite)
            ctx.ellipse(
                actionData.oldSelectionTopLeftCorner.x + actionData.oldSelectionWidth / 2,
                actionData.oldSelectionTopLeftCorner.y + actionData.oldSelectionHeight / 2,
                actionData.oldSelectionWidth / 2 - 1,
                actionData.oldSelectionHeight / 2 - 1,
                0,
                0,
                2 * Math.PI,
            );
        ctx.fill();
        ctx.closePath();
        this.drawImage(ctx, actionData);

        if (recordAction) {
            this.undoRedoService.addAction(new ToolAction(this.selectionService, Object.assign({}, actionData)));
        }
    }

    async getImageData(): Promise<void> {
        const ctx = this.drawingService.previewCtx;
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(
            this.selectionService.topLeftCorner.x + this.selectionService.width / 2,
            this.selectionService.topLeftCorner.y + this.selectionService.height / 2,
            this.selectionService.width / 2,
            this.selectionService.height / 2,
            0,
            0,
            2 * Math.PI,
        );
        ctx.clip();
        ctx.drawImage(this.drawingService.canvas, 0, 0);
        ctx.restore();
        await createImageBitmap(
            ctx.getImageData(
                this.selectionService.topLeftCorner.x,
                this.selectionService.topLeftCorner.y,
                this.selectionService.width,
                this.selectionService.height,
            ),
        ).then((data) => {
            this.selectionService.toolActionData.imageData = data;
        });
        this.drawingService.clearCanvas(ctx);
    }
}
