import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NewDrawingService } from '@app/services/file-options/new-drawing.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-new-drawing',
    templateUrl: './new-drawing.component.html',
    styleUrls: ['./new-drawing.component.scss'],
})
export class NewDrawingComponent {
    constructor(
        public dialogRef: MatDialogRef<NewDrawingComponent>,
        private resizeService: ResizingService,
        private toolSwitcherService: ToolSwitcherService,
        private newDrawingService: NewDrawingService,
        private undoRedoService: UndoRedoService,
    ) {
        this.newDrawingService.dialogRef = this.dialogRef;
    }

    newDrawing(): void {
        this.undoRedoService.newDrawing();
        this.resizeService.baseCanvas.width += 1;
        this.resizeService.baseCanvas.width -= 1;
        this.resizeService.previewCanvas.width += 1;
        this.resizeService.previewCanvas.width -= 1;
        this.toolSwitcherService.currentService.onSwitch();
        this.undoRedoService.reset();
        this.newDrawingService.initialSize();
        this.onCancel();
    }

    onCancel(): void {
        this.newDrawingService.onCancel();
    }
}
