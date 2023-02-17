import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { FinalizedSelection } from '@app/classes/selection/finalized-selection';
import { MovingSelectionByKeyboard } from '@app/classes/selection/moving-selection-keyboard';
import { MovingSelectionByMouse } from '@app/classes/selection/moving-selection-mouse';
import { NothingSelection } from '@app/classes/selection/nothing-selection';
import { PrototypeSelection } from '@app/classes/selection/prototype-selection';
import { ResizingSelection } from '@app/classes/selection/resize-selection';
import { Selection } from '@app/classes/selection/selection';
import { WaitingForSelectionByKeyboard } from '@app/classes/selection/waiting-selection-keyboard';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { LINE_DASH } from '@app/constants/style.constants';
import { SelectionButtonPosition, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable: no-empty <- Justified as this is an abstract class
export abstract class SelectionManager {
    prototypeSelection: PrototypeSelection = new PrototypeSelection(this.selectionService, this.drawingService, this.undoRedoService, this);
    movingSelectionByMouse: MovingSelectionByMouse = new MovingSelectionByMouse(
        this.selectionService,
        this.drawingService,
        this.undoRedoService,
        this,
    );
    movingSelectionByKeyboard: MovingSelectionByKeyboard = new MovingSelectionByKeyboard(
        this.selectionService,
        this.drawingService,
        this.undoRedoService,
        this,
    );
    finalizedSelection: FinalizedSelection = new FinalizedSelection(this.selectionService, this.drawingService, this.undoRedoService, this);
    nothingSelection: NothingSelection = new NothingSelection(this.selectionService, this.drawingService, this.undoRedoService, this);
    waitingForSelectionByKeyboard: WaitingForSelectionByKeyboard = new WaitingForSelectionByKeyboard(
        this.selectionService,
        this.drawingService,
        this.undoRedoService,
        this,
    );
    resizingSelection: ResizingSelection = new ResizingSelection(this.selectionService, this.drawingService, this.undoRedoService, this);

    protected selections: Map<SelectionState, Selection> = new Map<SelectionState, Selection>([
        [SelectionState.Nothing, this.nothingSelection],
        [SelectionState.DrawingSelectionBox, this.prototypeSelection],
        [SelectionState.SomethingHasBeenSelected, this.finalizedSelection],
        [SelectionState.MovingSelectionMouse, this.movingSelectionByMouse],
        [SelectionState.MovingSelectionKeyboard, this.movingSelectionByKeyboard],
        [SelectionState.WaitingToMoveSelectionKeyboard, this.waitingForSelectionByKeyboard],
        [SelectionState.ResizingSelection, this.resizingSelection],
    ]);

    constructor(protected selectionService: SelectionService, protected drawingService: DrawingService, protected undoRedoService: UndoRedoService) {}

    async onMouseUp(event: MouseEvent): Promise<void> {
        if (event.button !== MouseButton.Left) return;
        this.currentSelection.onMouseUp(event);
    }

    updateShapeDataResizing(): void {
        this.selectionService.topLeftCorner = new Vec2(
            Math.min(this.selectionService.mouseDownPosition.x, this.selectionService.mousePosition.x),
            Math.min(this.selectionService.mouseDownPosition.y, this.selectionService.mousePosition.y),
        );
        this.selectionService.width = Math.abs(this.selectionService.mousePosition.x - this.selectionService.mouseDownPosition.x);
        this.selectionService.height = Math.abs(this.selectionService.mousePosition.y - this.selectionService.mouseDownPosition.y);
        if (this.selectionService.topLeftCorner.x < 0) {
            this.selectionService.topLeftCorner.x = 0;
            this.selectionService.width = this.selectionService.mouseDownPosition.x;
        }
        if (this.selectionService.topLeftCorner.y < 0) {
            this.selectionService.topLeftCorner.y = 0;
            this.selectionService.height = this.selectionService.mouseDownPosition.y;
        }
        if (this.selectionService.topLeftCorner.x + this.selectionService.width > this.drawingService.canvas.width)
            this.selectionService.width = this.drawingService.canvas.width - this.selectionService.topLeftCorner.x;
        if (this.selectionService.topLeftCorner.y + this.selectionService.height > this.drawingService.canvas.height)
            this.selectionService.height = this.drawingService.canvas.height - this.selectionService.topLeftCorner.y;
        if (this.selectionService.shiftDown)
            this.selectionService.width = this.selectionService.height = Math.min(this.selectionService.width, this.selectionService.height);
    }

    updateView(): void {
        this.drawingService.clearCanvas(this.drawingService.selectionBoxCtx);
        this.currentSelection.updateView();
    }

    drawPerimiter(): void {
        this.drawingService.selectionBoxCtx.setLineDash(LINE_DASH);
        this.drawingService.selectionBoxCtx.lineJoin = 'miter';
        this.drawingService.selectionBoxCtx.lineWidth = 1;
        this.drawingService.selectionBoxCtx.strokeStyle = 'black';
        this.drawingService.selectionBoxCtx.strokeRect(
            this.selectionService.topLeftCorner.x,
            this.selectionService.topLeftCorner.y,
            this.selectionService.width,
            this.selectionService.height,
        );
    }

    draw(drawToBaseCanvas: boolean, actionData: SelectionActionData, recordAction?: boolean): void {}

    async getImageData(): Promise<void> {}

    onMouseMove(event: MouseEvent): void {
        this.currentSelection.onMouseMove(event);
    }

    onMouseDown(event: MouseEvent, isOverSelection: boolean = false, isOverButton: boolean = false, button?: SelectionButtonPosition): void {
        this.drawingService.clearCanvas(this.drawingService.selectionBoxCtx);
        this.currentSelection.onMouseDown(event, isOverSelection, isOverButton, button);
    }

    onClick(event: MouseEvent): void {
        this.currentSelection.onClick(event);
    }

    moveDrawingWithKeyboard(): void {
        this.currentSelection.moveDrawingWithKeyboard();
    }

    stopMoveDrawingWithKeyboard(): void {
        this.currentSelection.stopMoveDrawingWithKeyboard();
    }

    onKeyDown(event: KeyboardEvent): void {
        const keyPressed: string = event.key.toUpperCase();
        if (this.selectionService.arrowsPressed.has(event.key)) {
            this.selectionService.arrowsPressed.set(event.key, true);
            this.moveDrawingWithKeyboard();
        } else if (event.key === KeyboardButton.Shift) {
            this.selectionService.shiftDown = true;
            this.updateView();
        } else if (keyPressed === 'A' && event.ctrlKey) {
            event.preventDefault();
            this.selectionService.selectAllCanvas();
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.selectionService.arrowsPressed.has(event.key)) {
            this.selectionService.arrowsPressed.set(event.key, false);
            this.stopMoveDrawingWithKeyboard();
        } else if (event.key === KeyboardButton.Shift) {
            this.selectionService.shiftDown = false;
            this.updateView();
        } else {
            this.currentSelection.onKeyUp(event);
        }
    }

    finishDrawing(): void {
        this.currentSelection.finishDrawing();
    }

    get currentSelection(): Selection {
        return this.selections.get(this.selectionService.selectionState) as Selection;
    }

    protected drawImage(ctx: CanvasRenderingContext2D, actionData: SelectionActionData): void {
        ctx.save();
        ctx.translate(
            actionData.newSelectionTopLeftCorner.x + actionData.newSelectionWidth / 2,
            actionData.newSelectionTopLeftCorner.y + actionData.newSelectionHeight / 2,
        );
        ctx.scale(actionData.widthScale, actionData.heightScale);
        try {
            ctx.drawImage(
                actionData.imageData,
                -actionData.newSelectionWidth / 2,
                -actionData.newSelectionHeight / 2,
                actionData.newSelectionWidth,
                actionData.newSelectionHeight,
            );
        } catch (err) {
            //  Do nothing if the imageData has been closed
        }
        ctx.restore();
    }
}
