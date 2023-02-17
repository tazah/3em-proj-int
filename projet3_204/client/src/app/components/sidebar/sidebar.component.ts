import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileOptionShortcuts, FILE_OPTIONS_DICT } from '@app/constants/file-options.constants';
import { DEFAULT_TOOLTIP_DELAY, DEFAULT_TOOLTIP_POSITION } from '@app/constants/style.constants';
import { toolDict, ToolKey } from '@app/constants/tool.constants';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { DialogService } from '@app/services/dialog/dialog.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    DEFAULT_TOOLTIP_POSITION: typeof DEFAULT_TOOLTIP_POSITION = DEFAULT_TOOLTIP_POSITION;
    DEFAULT_TOOLTIP_DELAY: typeof DEFAULT_TOOLTIP_DELAY = DEFAULT_TOOLTIP_DELAY;
    ToolKey: typeof ToolKey = ToolKey;
    FileOptionShortcuts: typeof FileOptionShortcuts = FileOptionShortcuts;

    constructor(
        private toolSwitcherService: ToolSwitcherService,
        private dialogService: DialogService,
        private undoRedoService: UndoRedoService,
        private clipboardService: ClipboardService,
        private chatCommunicationService: ChatCommunicationService,
        private router: Router,
        public userAuthentificationService: UserAuthentificationService,
    ) {}

    get currentTool(): ToolKey {
        return this.toolSwitcherService.currentTool;
    }

    get toolDict(): typeof toolDict {
        return toolDict;
    }
    

    leaveCollabRoom() {
        this.chatCommunicationService.leaveCollabRoom(this.userAuthentificationService.userProtected.userName as string);
        this.router.navigateByUrl('/album');
    }

    get FILE_OPTIONS_DICT(): typeof FILE_OPTIONS_DICT {
        return FILE_OPTIONS_DICT;
    }

    onClick(tool: ToolKey): void {
        this.toolSwitcherService.switchTool(tool);
    }

    openDialog(option: FileOptionShortcuts): void {
        this.dialogService.switchDialog(option);
    }

    undo(): void {
        this.undoRedoService.undo();
    }

    redo(): void {
        this.undoRedoService.redo();
    }

    copy(): void {
        this.clipboardService.copy();
    }

    cut(): void {
        this.clipboardService.cut();
    }

    delete(): void {
        this.clipboardService.delete();
    }

    paste(): void {
        this.clipboardService.paste();
    }

    get noSelectionInMemory(): boolean {
        return this.clipboardService.noSelectionInMemory;
    }

    get isUsingTool(): boolean {
        return this.toolSwitcherService.currentService.started;
    }

    get undoArrayIsEmpty(): boolean {
        return this.undoRedoService.actionsDone.length === 0;
    }

    get newFile(): boolean {
        return this.undoRedoService.actionsDone.length === 0 && !this.undoRedoService.savedDrawingLoaded;
    }

    get redoArrayIsEmpty(): boolean {
        return this.undoRedoService.actionsUndone.length === 0;
    }

    get selectionOptionsAvailable(): boolean {
        return this.clipboardService.selectionOptionsAvailable;
    }
}
