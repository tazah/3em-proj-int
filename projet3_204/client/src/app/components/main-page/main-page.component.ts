import { Component } from '@angular/core';
import { FileOptionShortcuts } from '@app/constants/file-options.constants';
import { DialogService } from '@app/services/dialog/dialog.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'PolyDessin 2';

    constructor(public drawingService: DrawingService, private dialogService: DialogService, private undoRedoService: UndoRedoService) {
        //this.undoRedoService.loadDrawing();
    }

    openCarrousel(): void {
        this.dialogService.switchDialog(FileOptionShortcuts.ShowCarousel);
    }

    newDrawing(): void {
        this.undoRedoService.newDrawing();
    }

    get savedDrawingAvailable(): boolean {
        return this.undoRedoService.savedDrawingAvailable;
    }
}
