import { Injectable } from '@angular/core';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { FileOptionShortcuts, SelectionOptionShortcuts } from '@app/constants/file-options.constants';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionType, SELECTION_ELLIPSE_KEY, SELECTION_LASSO_KEY, ToolKey } from '@app/constants/tool.constants';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { DialogService } from '@app/services/dialog/dialog.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Injectable({
    providedIn: 'root',
})
export class KeypressHandlerService {
    constructor(
        private toolSwitcherService: ToolSwitcherService,
        private dialogService: DialogService,
        private undoRedoService: UndoRedoService,
        private clipBoardService: ClipboardService,
    ) {}
    private disabled: boolean = false;

    onKeyPress(event: KeyboardEvent): void {
        if (this.dialogService.disableKeys || this.disabled) return;
        const keyPressed: string = event.key.toUpperCase();
        if (keyPressed === ToolKey.Selection) {
            this.toolSwitcherService.switchTool(ToolKey.Selection, { type: SelectionType.Rectangle } as SelectionActionData);
        } else if (keyPressed === SELECTION_ELLIPSE_KEY) {
            this.toolSwitcherService.switchTool(ToolKey.Selection, { type: SelectionType.Ellipse } as SelectionActionData);
        } else if (keyPressed === SELECTION_LASSO_KEY) {
            this.toolSwitcherService.switchTool(ToolKey.Selection, { type: SelectionType.Lasso } as SelectionActionData);
        } else if (Object.values(ToolKey).includes(keyPressed as ToolKey)) {
            this.toolSwitcherService.switchTool(keyPressed as ToolKey);
        } else {
            this.toolSwitcherService.currentService.onKeyPress(event);
        }
    }

    private checkOptionShortcuts(event: KeyboardEvent): void {
        const keyPressed: string = event.key.toUpperCase();
        if (
            (Object.values(SelectionOptionShortcuts).includes(keyPressed as SelectionOptionShortcuts) && event.ctrlKey) ||
            event.key === KeyboardButton.Delete
        ) {
            this.clipBoardService.onKeyDown(event);
        } else if (Object.values(FileOptionShortcuts).includes(keyPressed as FileOptionShortcuts) && event.ctrlKey) {
            event.preventDefault();
            this.dialogService.switchDialog(keyPressed as FileOptionShortcuts);
        }
    }

    private checkUndoRedo(event: KeyboardEvent): void {
        const keyPressed: string = event.key.toUpperCase();
        const toolIsBeingUsed = this.toolSwitcherService.currentService.started;
        if (keyPressed === 'Z' && event.ctrlKey && event.shiftKey && !toolIsBeingUsed) {
            event.preventDefault();
            this.undoRedoService.redo();
        } else if (keyPressed === 'Z' && event.ctrlKey && !toolIsBeingUsed) {
            event.preventDefault();
            this.undoRedoService.undo();
        }
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.dialogService.disableKeys || this.disabled) return;

        this.toolSwitcherService.currentService.onKeyDown(event);

        this.checkOptionShortcuts(event);
        this.checkUndoRedo(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (this.disabled) return;
        this.toolSwitcherService.currentService.onKeyUp(event);
    }

    onEditTextFocus(): void {
        this.disabled = true;
    }

    onEditTextFocusOut(): void {
        this.disabled = false;
    }
}
