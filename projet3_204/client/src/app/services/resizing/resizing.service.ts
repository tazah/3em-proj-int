import { Injectable } from '@angular/core';
import { ResizeAction } from '@app/classes/actions/resize-action';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse.constants';
import { BUTTON_POSITION, DEFAULT_HEIGHT, DEFAULT_MARGINS, DEFAULT_WIDTH, MIN_HEIGHT, MIN_WIDTH } from '@app/constants/style.constants';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ResizingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    baseCanvas: HTMLCanvasElement;
    previewCanvas: HTMLCanvasElement;
    private mouseStartCoords: Vec2;

    canvasContainerParent: HTMLElement;

    isDragging: boolean = false;
    hasResized: boolean = false;
    borderStyle: string = '';
    private buttonPosition: string = '';

    canvasSize: Vec2 = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    previewCanvasSize: Vec2 = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
    initialCanvasDimensions: Vec2;
    workspaceSize: Vec2;

    constructor(private undoRedoService: UndoRedoService) {
        undoRedoService.resizingService = this;
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;

        this.isDragging = true;
        this.mouseStartCoords = new Vec2(event.x, event.y);
        this.borderStyle = '1px dashed black';
        this.buttonPosition = (event.target as HTMLElement).id;
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.isDragging) return;

        const oldDimensions = this.canvasSize;
        this.setSize(this.previewCanvasSize);

        this.undoRedoService.addAction(new ResizeAction(this.canvasSize, oldDimensions, this, this.baseCtx));

        this.borderStyle = '';
        this.isDragging = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.isDragging) return;

        if (event.buttons === 0) {
            this.onMouseUp(event);
            return;
        }
        this.workspaceSize = new Vec2(
            this.canvasContainerParent.clientWidth - DEFAULT_MARGINS,
            this.canvasContainerParent.clientHeight - DEFAULT_MARGINS,
        );

        this.updateCanvasDims(event);
        this.checkCanvasDims();
    }

    private checkCanvasDims(): void {
        this.previewCanvasSize.x = this.previewCanvasSize.x < MIN_WIDTH ? MIN_WIDTH : this.previewCanvasSize.x;
        this.previewCanvasSize.y = this.previewCanvasSize.y < MIN_HEIGHT ? MIN_HEIGHT : this.previewCanvasSize.y;

        this.previewCanvasSize.x =
            this.previewCanvasSize.x < this.workspaceSize.x || this.canvasSize.x > this.workspaceSize.x
                ? this.previewCanvasSize.x
                : this.workspaceSize.x;
        this.previewCanvasSize.y =
            this.previewCanvasSize.y < this.workspaceSize.y || this.canvasSize.y > this.workspaceSize.y
                ? this.previewCanvasSize.y
                : this.workspaceSize.y;
    }

    private updateCanvasDims(event: MouseEvent): void {
        switch (this.buttonPosition) {
            case BUTTON_POSITION.Bottom:
                this.previewCanvasSize.y = event.y - (this.mouseStartCoords.y - this.canvasSize.y);
                break;

            case BUTTON_POSITION.Right:
                this.previewCanvasSize.x = event.x - (this.mouseStartCoords.x - this.canvasSize.x);
                break;

            case BUTTON_POSITION.Corner:
                this.previewCanvasSize.x = event.x - (this.mouseStartCoords.x - this.canvasSize.x);
                this.previewCanvasSize.y = event.y - (this.mouseStartCoords.y - this.canvasSize.y);
                break;
        }
    }

    resetCanvasDims(): void {
        this.setSize(this.initialCanvasDimensions);
    }

    setSize(newSize: Vec2): void {
        this.canvasSize = new Vec2(newSize);
        this.previewCanvasSize = new Vec2(newSize);

        this.hasResized = true;
    }
}
