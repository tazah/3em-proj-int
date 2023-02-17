import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { ToolAction } from '@app/classes/actions/tool-action';
import { Vec2 } from '@app/classes/vec2';
import { BLACK } from '@app/constants/color.constants';
import { LINE_DASH } from '@app/constants/style.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { FinalizedSelectionLasso } from './finalized-selection-lasso';
import { NothingSelectionLasso } from './nothing-selection-lasso';
import { PrototypeSelectionLasso } from './prototype-selection-lasso';
import { SelectionManager } from './selection-manager';

export class LassoSelectionManager extends SelectionManager {
    constructor(protected selectionService: SelectionService, protected drawingService: DrawingService, protected undoRedoService: UndoRedoService) {
        super(selectionService, drawingService, undoRedoService);
        this.selections.set(SelectionState.Nothing, this.nothingSelectionLasso);
        this.selections.set(SelectionState.DrawingSelectionBox, this.prototypeSelectionLasso);
        this.selections.set(SelectionState.SomethingHasBeenSelected, this.finalizedSelectionLasso);
    }

    get toolActionData(): SelectionActionData {
        return this.selectionService.toolActionData;
    }

    get pathData(): Vec2[] {
        return this.toolActionData.pathData;
    }
    prototypeSelectionLasso: PrototypeSelectionLasso = new PrototypeSelectionLasso(
        this.selectionService,
        this.drawingService,
        this.undoRedoService,
        this,
    );
    nothingSelectionLasso: NothingSelectionLasso = new NothingSelectionLasso(this.selectionService, this.drawingService, this.undoRedoService, this);
    finalizedSelectionLasso: FinalizedSelectionLasso = new FinalizedSelectionLasso(
        this.selectionService,
        this.drawingService,
        this.undoRedoService,
        this,
    );

    private minNode: Vec2;

    static getMinAndMaxPoint(pathData: Vec2[]): Vec2[] {
        const minNode = new Vec2(pathData[0]);
        const maxNode = new Vec2(pathData[0]);
        for (let i = 1; i < pathData.length; i++) {
            if (pathData[i].x < minNode.x) minNode.x = pathData[i].x;
            else if (pathData[i].x > maxNode.x) maxNode.x = pathData[i].x;
            if (pathData[i].y < minNode.y) minNode.y = pathData[i].y;
            else if (pathData[i].y > maxNode.y) maxNode.y = pathData[i].y;
        }
        return [minNode, maxNode];
    }

    updateShapeDataResizing(): void {
        let maxNode;
        [this.minNode, maxNode] = LassoSelectionManager.getMinAndMaxPoint(this.pathData);
        this.selectionService.topLeftCorner = this.minNode;
        this.selectionService.width = maxNode.x - this.minNode.x;
        this.selectionService.height = maxNode.y - this.minNode.y;
    }

    drawPerimiter(): void {
        this.drawingService.selectionBoxCtx.save();
        const ctx = this.drawingService.selectionBoxCtx;
        this.drawingService.clearCanvas(ctx);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.setLineDash(LINE_DASH);
        ctx.strokeStyle = BLACK;
        ctx.lineWidth = 1;
        ctx.beginPath();
        const distanceFromOriginalPosition = new Vec2(
            this.toolActionData.newSelectionTopLeftCorner.x - this.toolActionData.oldSelectionTopLeftCorner.x,
            this.toolActionData.newSelectionTopLeftCorner.y - this.toolActionData.oldSelectionTopLeftCorner.y,
        );
        const xScale = this.toolActionData.newSelectionWidth / this.toolActionData.oldSelectionWidth;
        const yScale = this.toolActionData.newSelectionHeight / this.toolActionData.oldSelectionHeight;
        for (const point of this.pathData) {
            ctx.lineTo(
                this.minNode.x + (point.x - this.minNode.x) * xScale + distanceFromOriginalPosition.x,
                this.minNode.y + (point.y - this.minNode.y) * yScale + distanceFromOriginalPosition.y,
            );
        }
        ctx.stroke();
        ctx.closePath();
        super.drawPerimiter();
        this.drawingService.selectionBoxCtx.restore();
    }

    draw(drawToBaseCanvas: boolean, actionData: SelectionActionData, recordAction?: boolean, lastPoint?: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const ctx = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        ctx.fillStyle = 'white';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (actionData.shouldFillOriginalWhite)
            for (const point of actionData.pathData) {
                ctx.lineTo(point.x, point.y);
            }
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
        for (const point of this.pathData) {
            ctx.lineTo(point.x, point.y);
        }
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
            this.toolActionData.imageData = data;
        });
        this.drawingService.clearCanvas(ctx);
    }
}
