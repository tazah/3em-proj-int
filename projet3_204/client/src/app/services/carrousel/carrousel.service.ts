import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Vec2 } from '@app/classes/vec2';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { NetworkService } from '@app/services/network/network.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Drawing } from '@common/classes/drawing';

@Injectable({
    providedIn: 'root',
})
// tslint:disable: deprecation <- Does not affect the linter
export class CarrouselService {
    dialogRef: MatDialogRef<CarrouselComponent>;
    drawings: Drawing[] = [];
    filteredDrawings: Drawing[] = [];

    constructor(
        private networkService: NetworkService,
        private snackBar: MatSnackBar,
        private undoRedoService: UndoRedoService,
        private resizeService: ResizingService,
    ) {}

    onCancel(): void {
        this.dialogRef.close();
    }

    continueDrawing(drawingUrl: string): void {
        if (this.undoRedoService.savedDrawingAvailable) {
            const response = confirm('Attention! Le dessin actuel sera supprimé, voulez-vous continuer?');
            if (!response) return;
        }

        const htmlImg = new Image();
        htmlImg.src = drawingUrl;
        htmlImg.onload = () => {
            this.undoRedoService.reset();
            this.resizeService.initialCanvasDimensions = new Vec2(htmlImg.width, htmlImg.height);
            this.resizeService.resetCanvasDims();
            this.undoRedoService.canvasImg = htmlImg;
            this.onCancel();
        };
    }

    filterDrawings(tags: string[]): void {
        this.filteredDrawings = [];
        for (const drawing of this.drawings) {
            for (const tag of tags) {
                if (drawing.tags.includes(tag)) {
                    this.filteredDrawings.push(drawing);
                    break;
                }
            }
        }
    }

    async loadImagesFromServer(): Promise<void> {
        this.networkService.getAllDrawings().then(
            (drawings) => {
                this.drawings = drawings;
            },
            (err: HttpErrorResponse) => {
                this.snackBar.open(err.message, undefined, { duration: 3000 });
            },
        );
    }

    async deleteDrawing(drawing: Drawing): Promise<void> {
        this.networkService.deleteDrawing(drawing);
    }
}
