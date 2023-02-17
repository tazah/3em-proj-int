import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { EXPORT_PREVIEW_HEIGHT, EXPORT_PREVIEW_WIDTH } from '@app/constants/file-options.constants';
import { NetworkService } from '@app/services/network/network.service';
import { Drawing } from '@common/classes/drawing';

@Injectable({
    providedIn: 'root',
})
export class SaveDrawingService {
    dialogRef: MatDialogRef<SaveDrawingComponent>;
    previewCanvas: HTMLCanvasElement;
    previewCtx: CanvasRenderingContext2D;
    originalCanvas: HTMLCanvasElement;

    previewCanvasWidth: number = EXPORT_PREVIEW_WIDTH;
    previewCanvasHeight: number = EXPORT_PREVIEW_HEIGHT;

    constructor(private networkService: NetworkService) {}

    onSave(title: string, tags: string[], savingInPng: boolean): void {
        const imageUrl = savingInPng ? this.previewCanvas.toDataURL() : this.previewCanvas.toDataURL('image/jpeg', 1.0);
        const drawing = { title, tags, image: imageUrl } as Drawing;
        this.networkService.sendDrawing(drawing);
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
