import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { ToolAction } from '@app/classes/actions/tool-action';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionManager } from './selection-manager';

export class RectangleSelectionManager extends SelectionManager {
    constructor(protected selectionService: SelectionService, protected drawingService: DrawingService, protected undoRedoService: UndoRedoService) {
        super(selectionService, drawingService, undoRedoService);
    }

    draw(drawToBaseCanvas: boolean, actionData: SelectionActionData, recordAction?: boolean): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const ctx = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        ctx.fillStyle = 'white';
        if (actionData.shouldFillOriginalWhite)
            ctx.fillRect(
                actionData.oldSelectionTopLeftCorner.x,
                actionData.oldSelectionTopLeftCorner.y,
                actionData.oldSelectionWidth,
                actionData.oldSelectionHeight,
            );
        this.drawImage(ctx, actionData);

        if (recordAction) {
            this.undoRedoService.addAction(new ToolAction(this.selectionService, Object.assign({}, actionData)));
        }
    }

    async getImageData(): Promise<void> {
        const ctx = this.drawingService.previewCtx;
        ctx.save();
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

    drawPerimiter(): void {
        this.drawingService.selectionBoxCtx.save();
        super.drawPerimiter();
        this.drawingService.selectionBoxCtx.restore();
    }
}
