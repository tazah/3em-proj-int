import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { ExportComponent } from '@app/components/export/export.component';
import { NewDrawingComponent } from '@app/components/new-drawing/new-drawing.component';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { CARROUSEL_DIALOG_CLASS, EXPORT_DIALOG_CLASS, FileOptionShortcuts, SAVE_DIALOG_CLASS } from '@app/constants/file-options.constants';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
// tslint:disable: deprecation <- Does not affect the linter
export class DialogService {
    disableKeys: boolean = false;

    constructor(private dialog: MatDialog, private undoRedoService: UndoRedoService) {}
    // Inspired from https://stackblitz.com/edit/mat-dialog-generic-creation?file=app%2Fapp.component.ts

    constructDialog<T>(tCtor: ComponentType<T>): MatDialogRef<T> {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        const dialogRef = this.dialog.open(tCtor, dialogConfig);
        return dialogRef;
    }

    switchDialog(option: FileOptionShortcuts): void {
        if (option === FileOptionShortcuts.ShowCarousel) {
            const dialogRef = this.constructDialog(CarrouselComponent);
            dialogRef.addPanelClass(CARROUSEL_DIALOG_CLASS);
            this.disableKeys = true;
            dialogRef.afterClosed().subscribe(() => {
                this.disableKeys = false;
            });
            return;
        }
        if (this.undoRedoService.actionsDone.length === 0 && !this.undoRedoService.savedDrawingLoaded) return;
        switch (option) {
            case FileOptionShortcuts.ExportDrawing:
                {
                    const dialogRef = this.constructDialog(ExportComponent);
                    dialogRef.addPanelClass(EXPORT_DIALOG_CLASS);
                    this.disableKeys = true;
                    dialogRef.afterClosed().subscribe(() => {
                        this.disableKeys = false;
                    });
                }
                break;

            case FileOptionShortcuts.CreateNewDrawing:
                {
                    const dialogRef = this.constructDialog(NewDrawingComponent);
                    this.disableKeys = true;
                    dialogRef.afterClosed().subscribe(() => {
                        this.disableKeys = false;
                    });
                }
                break;

            case FileOptionShortcuts.SaveDrawing:
                {
                    const dialogRef = this.constructDialog(SaveDrawingComponent);
                    dialogRef.addPanelClass(SAVE_DIALOG_CLASS);
                    this.disableKeys = true;
                    dialogRef.afterClosed().subscribe(() => {
                        this.disableKeys = false;
                    });
                }
                break;
        }
    }
}
