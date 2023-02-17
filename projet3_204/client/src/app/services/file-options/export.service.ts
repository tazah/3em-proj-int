import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ExportComponent } from '@app/components/export/export.component';
import { EXPORT_PREVIEW_HEIGHT, EXPORT_PREVIEW_WIDTH } from '@app/constants/file-options.constants';

@Injectable({
    providedIn: 'root',
})
export class ExportService {
    dialogRef: MatDialogRef<ExportComponent>;
    previewCanvas: HTMLCanvasElement;
    previewCtx: CanvasRenderingContext2D;
    downloadCanvas: HTMLCanvasElement;
    downloadCtx: CanvasRenderingContext2D;
    private filtre: string;
    originalCanvas: HTMLCanvasElement;

    previewCanvasWidth: number = EXPORT_PREVIEW_WIDTH;
    previewCanvasHeight: number = EXPORT_PREVIEW_HEIGHT;

    setFilter(filtre: string): void {
        this.filtre = filtre;

        this.previewCtx.filter = this.filtre;
    }

    applyFilter(filtre: string): void {
        switch (filtre) {
            case 'Aucun filtre':
                this.setFilter('none');
                break;
            case 'Brouillé':
                this.setFilter('blur(5px)');
                break;
            case 'Inversion des couleurs':
                this.setFilter('invert(100%)');
                break;
            case 'Hue-rotation':
                this.setFilter('hue-rotate(90deg)');
                break;
            case 'Sepia':
                this.setFilter('sepia(60%)');
                break;
            case 'Contrast':
                this.setFilter('contrast(200%)');
                break;
        }
        this.previewCtx.drawImage(this.originalCanvas, 0, 0, this.previewCanvasWidth, this.previewCanvasHeight);
    }

    configureDownloadImage(): void {
        this.downloadCanvas = document.createElement('canvas');
        this.downloadCanvas.width = this.originalCanvas.width;
        this.downloadCanvas.height = this.originalCanvas.height;
        this.downloadCtx = this.downloadCanvas.getContext('2d') as CanvasRenderingContext2D;
        this.downloadCtx.fillStyle = ' white';
        this.downloadCtx.fillRect(0, 0, this.downloadCanvas.width, this.downloadCanvas.height);
        this.downloadCtx.filter = this.filtre;
        this.downloadCtx.drawImage(this.originalCanvas, 0, 0);
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
