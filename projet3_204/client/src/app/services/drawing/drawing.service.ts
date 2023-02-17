import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DrawingService {
    baseCtx: CanvasRenderingContext2D;
    previewCtx: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    selectionBoxCtx: CanvasRenderingContext2D;

    clearCanvas(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    setCanvasBackgroundToWhite(): void {
        if (!this.baseCtx || !this.canvas) return;
        this.baseCtx.fillStyle = 'white';
        this.baseCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
