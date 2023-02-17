import { Injectable } from '@angular/core';
import { Action } from '@app/classes/actions/action';
import { ResizeAction } from '@app/classes/actions/resize-action';
import { Vec2 } from '@app/classes/vec2';
import { LOCAL_STORAGE_DRAWING_KEY, LOCAL_STORAGE_INITIAL_DIMENSIONS } from '@app/constants/file-options.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizingService } from '@app/services/resizing/resizing.service';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService {
    canvasImg: CanvasImageSource;
    private canvasImgDims: Vec2;
    actionsDone: Action[] = [];
    actionsUndone: Action[] = [];
    resizingService: ResizingService;

    savedDrawingAvailable: boolean = false;
    savedDrawingLoaded: boolean = false;

    private actionToBeLinkedAvailable: boolean = false;
    private actionToBeLinked: Action;

    constructor(private drawingService: DrawingService) {}

    undo(): void {
        if (this.actionsDone.length === 0) return;
        this.actionsUndone.push(this.actionsDone.pop() as Action);

        this.drawingService.clearCanvas(this.drawingService.baseCtx);
        this.resizingService.resetCanvasDims();
        this.actionsDone.forEach((element) => {
            element.executeResizeAction();
        });
    }

    redo(): void {
        if (this.actionsUndone.length === 0) return;
        const action = this.actionsUndone.pop() as Action;
        action.executeAll();
        this.actionsDone.push(action);
        this.saveDrawing();
    }

    addAction(action: Action): void {
        this.actionsUndone = [];
        if (this.actionToBeLinkedAvailable) action.pushLinkedAction(this.actionToBeLinked);
        this.actionToBeLinkedAvailable = false;
        this.actionsDone.push(action);
        if (!(action instanceof ResizeAction)) this.saveDrawing();
    }

    addActionToBeLinked(action: Action): void {
        this.actionToBeLinked = action;
        this.actionToBeLinkedAvailable = true;
    }

    refreshView(): void {
        this.loadBaseImage();
        this.actionsDone.forEach((element) => {
            element.execute();
        });
        if (this.actionsDone.length > 0) this.saveDrawing();
    }

    reset(): void {
        this.actionsDone = [];
        this.actionsUndone = [];
        this.drawingService.setCanvasBackgroundToWhite();
    }

    loadBaseImage(): void {
        if (!this.savedDrawingLoaded) return;
        this.drawingService.baseCtx.drawImage(this.canvasImg, 0, 0);
    }

    loadDrawing(): void {
        const savedDrawingJSONString = JSON.parse(localStorage.getItem(LOCAL_STORAGE_DRAWING_KEY) as string);
        const canvasSize = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INITIAL_DIMENSIONS) as string);
        if (!savedDrawingJSONString || !canvasSize) return;
        const image = new Image();
        image.src = savedDrawingJSONString;
        this.canvasImg = image;
        this.canvasImgDims = new Vec2(canvasSize.x, canvasSize.y);
        this.savedDrawingLoaded = this.savedDrawingAvailable = true;
    }

    newDrawing(): void {
        this.canvasImg = {} as CanvasImageSource;
        localStorage.removeItem(LOCAL_STORAGE_DRAWING_KEY);
        localStorage.removeItem(LOCAL_STORAGE_INITIAL_DIMENSIONS);
        this.savedDrawingAvailable = this.savedDrawingLoaded = false;
    }

    setInitialDimensions(): void {
        this.resizingService.initialCanvasDimensions = this.canvasImgDims;
        this.resizingService.resetCanvasDims();
    }

    saveDrawing(): void {
        localStorage.setItem(LOCAL_STORAGE_DRAWING_KEY, JSON.stringify(this.drawingService.canvas.toDataURL()));
        localStorage.setItem(LOCAL_STORAGE_INITIAL_DIMENSIONS, JSON.stringify(this.resizingService.canvasSize));
    }

    set image(data: CanvasImageSource) {
        this.savedDrawingLoaded = true;
        this.canvasImg = data;
    }
}
