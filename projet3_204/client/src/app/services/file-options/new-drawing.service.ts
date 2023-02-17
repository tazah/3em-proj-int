import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { NewDrawingComponent } from '@app/components/new-drawing/new-drawing.component';
import { MIN_HEIGHT, MIN_WIDTH } from '@app/constants/style.constants';
import { ResizingService } from '@app/services/resizing/resizing.service';

@Injectable({
    providedIn: 'root',
})
export class NewDrawingService {
    dialogRef: MatDialogRef<NewDrawingComponent>;

    constructor(private resizingService: ResizingService) {}

    initialSize(): void {
        const baseInitialSize = new Vec2(window.innerWidth / 2, window.innerHeight / 2);
        this.resizingService.previewCanvasSize.x = baseInitialSize.x < MIN_WIDTH ? MIN_WIDTH : baseInitialSize.x;
        this.resizingService.previewCanvasSize.y = baseInitialSize.y < MIN_HEIGHT ? MIN_HEIGHT : baseInitialSize.y;
        this.resizingService.canvasSize = new Vec2(this.resizingService.previewCanvasSize);
        this.resizingService.initialCanvasDimensions = this.resizingService.canvasSize;
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
