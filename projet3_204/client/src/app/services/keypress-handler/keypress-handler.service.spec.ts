import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { FileOptionShortcuts } from '@app/constants/file-options.constants';
import { SelectionType, SELECTION_ELLIPSE_KEY, SELECTION_LASSO_KEY, ToolKey } from '@app/constants/tool.constants';
import { DialogService } from '@app/services/dialog/dialog.service';
import { KeypressHandlerService } from '@app/services/keypress-handler/keypress-handler.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable: no-string-literal
describe('KeypressHandlerService', () => {
    let service: KeypressHandlerService;
    let toolSwitcherServiceSpy: jasmine.SpyObj<ToolSwitcherService>;
    let toolServiceStub: jasmine.SpyObj<RectangleService>;
    let dialogServiceSpy: jasmine.SpyObj<DialogService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;

    beforeEach(() => {
        toolSwitcherServiceSpy = jasmine.createSpyObj('ToolSwitcherService', ['switchTool', 'currentService']);
        toolServiceStub = jasmine.createSpyObj('RectangleService', ['onKeyDown', 'onKeyUp', 'onKeyPress']);
        dialogServiceSpy = jasmine.createSpyObj('DialogService', ['switchDialog']);
        toolSwitcherServiceSpy.currentService = toolServiceStub;
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['undo', 'redo']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', []);

        TestBed.configureTestingModule({
            providers: [
                { provide: ToolSwitcherService, useValue: toolSwitcherServiceSpy },
                { provide: DialogService, useValue: dialogServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: SelectionService, useValue: selectionServiceSpy },
            ],
        });
        service = TestBed.inject(KeypressHandlerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('onKeyPress()', () => {
        it("should call toolHandlerService's switchTool when receiving a specific Keypress event", () => {
            const event = { key: ToolKey.Mouse } as KeyboardEvent;
            service.onKeyPress(event);
            expect(toolSwitcherServiceSpy.switchTool).toHaveBeenCalled();
        });

        it("should not call the toolHandlerService's switchTool when receiving a random Keypress event", () => {
            const event = { key: 'u' } as KeyboardEvent;
            service.onKeyPress(event);
            expect(toolSwitcherServiceSpy.switchTool).not.toHaveBeenCalled();
        });

        it("should call the toolHandlerService's switchTool when receiving a random Keypress event", () => {
            const event = { key: 'u' } as KeyboardEvent;
            service.onKeyPress(event);
            expect(toolSwitcherServiceSpy.switchTool).not.toHaveBeenCalled();
        });

        it('should disable and enable the keyboardService', () => {
            const event = { key: ToolKey.Mouse } as KeyboardEvent;

            service.onEditTextFocus();
            expect(service['disabled']).toEqual(true);
            service.onKeyPress(event);
            expect(toolSwitcherServiceSpy.switchTool).not.toHaveBeenCalled();

            service.onEditTextFocusOut();
            expect(service['disabled']).toEqual(false);
            service.onKeyPress(event);
            expect(toolSwitcherServiceSpy.switchTool).toHaveBeenCalled();
        });

        it('should switch to the rectangle selection tool if the appropricate key is pressed', () => {
            service.onKeyPress({ key: ToolKey.Selection } as KeyboardEvent);
            expect(toolSwitcherServiceSpy.switchTool).toHaveBeenCalledWith(ToolKey.Selection, {
                type: SelectionType.Rectangle,
            } as SelectionActionData);
        });

        it('should switch to the ellipse selection tool if the appropricate key is pressed', () => {
            service.onKeyPress({ key: SELECTION_ELLIPSE_KEY } as KeyboardEvent);
            expect(toolSwitcherServiceSpy.switchTool).toHaveBeenCalledWith(ToolKey.Selection, {
                type: SelectionType.Ellipse,
            } as SelectionActionData);
        });

        it('should switch to the lasso selection tool if the appropricate key is pressed', () => {
            service.onKeyPress({ key: SELECTION_LASSO_KEY } as KeyboardEvent);
            expect(toolSwitcherServiceSpy.switchTool).toHaveBeenCalledWith(ToolKey.Selection, {
                type: SelectionType.Lasso,
            } as SelectionActionData);
        });
    });

    describe('onKeyDown()', () => {
        it('should call switchDialog when it is not disabled ', () => {
            service['disabled'] = false;
            const event = { key: FileOptionShortcuts.CreateNewDrawing, ctrlKey: true } as KeyboardEvent;
            // tslint:disable: no-empty
            event.preventDefault = (): void => {};
            dialogServiceSpy.disableKeys = false;
            service.onKeyDown(event);
            expect(dialogServiceSpy.switchDialog).toHaveBeenCalled();
        });

        it('should not call switchDialog when it is  disabled ', () => {
            service['disabled'] = false;
            const event = { key: FileOptionShortcuts.ExportDrawing, ctrlKey: true } as KeyboardEvent;
            // tslint:disable: no-empty
            event.preventDefault = (): void => {};
            dialogServiceSpy.disableKeys = true;
            service.onKeyDown(event);
            expect(dialogServiceSpy.switchDialog).not.toHaveBeenCalled();
        });

        it('should not call switchDialog when a random key is pressed ', () => {
            service['disabled'] = false;
            const event = { key: 'x', ctrlKey: true } as KeyboardEvent;
            // tslint:disable: no-empty
            event.preventDefault = (): void => {};
            dialogServiceSpy.disableKeys = false;
            service.onKeyDown(event);
            expect(dialogServiceSpy.switchDialog).not.toHaveBeenCalled();
        });

        it("should not call the currentService's onKeyDown function when it is disabled", () => {
            service['disabled'] = true;
            const event = { key: 'Shift' } as KeyboardEvent;
            service.onKeyDown(event);
            expect(toolSwitcherServiceSpy.currentService.onKeyDown).not.toHaveBeenCalledWith(event);
        });

        it("should call the currentService's onKeyDown function when it is not disabled", () => {
            service['disabled'] = false;
            const event = { key: 'Shift' } as KeyboardEvent;
            service.onKeyDown(event);
            expect(toolSwitcherServiceSpy.currentService.onKeyDown).toHaveBeenCalledWith(event);
        });

        it('should call redo if pressed ctrl+shift+z', () => {
            service['disabled'] = false;
            const event = { key: 'z', ctrlKey: true, shiftKey: true, preventDefault: () => {} } as KeyboardEvent;
            service.onKeyDown(event);
            expect(undoRedoServiceSpy.redo).toHaveBeenCalled();
        });

        it('should call undo if pressed ctrl+z', () => {
            service['disabled'] = false;
            const event = { key: 'z', ctrlKey: true, preventDefault: () => {} } as KeyboardEvent;
            service.onKeyDown(event);
            expect(undoRedoServiceSpy.undo).toHaveBeenCalled();
        });
    });

    describe('onKeyUp()', () => {
        it("should not call the currentService's onKeyUp function when it is disabled", () => {
            service['disabled'] = true;
            const event = { key: 'Shift' } as KeyboardEvent;
            service.onKeyUp(event);
            expect(toolSwitcherServiceSpy.currentService.onKeyUp).not.toHaveBeenCalledWith(event);
        });

        it("should call the currentService's onKeyUp function when it is not disabled", () => {
            service['disabled'] = false;
            const event = { key: 'Shift' } as KeyboardEvent;
            service.onKeyUp(event);
            expect(toolSwitcherServiceSpy.currentService.onKeyUp).toHaveBeenCalledWith(event);
        });
    });
});
