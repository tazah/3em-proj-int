import { Injectable } from '@angular/core';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { ToolAction } from '@app/classes/actions/tool-action';
import { SelectionOptionShortcuts } from '@app/constants/file-options.constants';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class ClipboardService {
    private selectionActionData: SelectionActionData = new SelectionActionData();
    noSelectionInMemory: boolean = true;
    constructor(private selectionService: SelectionService, private undoRedoService: UndoRedoService) {}

    onKeyDown(event: KeyboardEvent): void {
        if (event.key === KeyboardButton.Delete) {
            this.delete();
            return;
        }
        switch (event.key.toUpperCase() as SelectionOptionShortcuts) {
            case SelectionOptionShortcuts.Copy:
                this.copy();
                break;
            case SelectionOptionShortcuts.Cut:
                this.cut();
                break;
            case SelectionOptionShortcuts.Paste:
                this.paste();
                break;
        }
    }

    delete(): void {
        if (this.selectionService.selectionState !== SelectionState.SomethingHasBeenSelected) return;
        this.undoRedoService.addActionToBeLinked(new ToolAction(this.selectionService, Object.assign({}, this.selectionService.toolActionData)));
        SelectionActionData.prepareForDelete(this.toolActionData);
        this.selectionService.finishDrawing();
    }

    cut(): void {
        this.copy();
        this.delete();
    }

    async copy(): Promise<void> {
        if (this.selectionService.selectionState !== SelectionState.SomethingHasBeenSelected) return;
        this.selectionActionData = Object.assign({}, this.selectionService.toolActionData);
        this.selectionActionData.imageData = await createImageBitmap(this.selectionService.toolActionData.imageData);
        this.noSelectionInMemory = false;
    }

    async paste(): Promise<void> {
        if (this.noSelectionInMemory) return;
        this.selectionService.finishDrawing();
        SelectionActionData.prepareForPaste(this.selectionActionData);
        this.selectionService.toolActionData = Object.assign({}, this.selectionActionData);
        this.selectionActionData.imageData = await createImageBitmap(this.selectionService.toolActionData.imageData);
        this.selectionService.selectionState = SelectionState.SomethingHasBeenSelected;
        this.selectionService.currentSelectionManager.updateView();
    }

    get selectionOptionsAvailable(): boolean {
        return (
            this.selectionService.selectionState !== SelectionState.DrawingSelectionBox &&
            this.selectionService.selectionState !== SelectionState.Nothing
        );
    }

    get toolActionData(): SelectionActionData {
        return this.selectionService.toolActionData;
    }
}
