import { TestBed } from '@angular/core/testing';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionManager } from './selection-manager';
import { WaitingForSelectionByKeyboard } from './waiting-selection-keyboard';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('WaitingForSelectionByKeyboard', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let waitingForSelectionKeyboard: WaitingForSelectionByKeyboard;

    beforeEach(async () => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', ['updateView', 'getImageData', 'updateShapeDataResizing', 'drawPerimiter']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse']);

        TestBed.configureTestingModule({});

        waitingForSelectionKeyboard = new WaitingForSelectionByKeyboard(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);
    });

    describe('stopMoveDrawingWithKeyboard()', () => {
        it('should set the correct state and update the view', () => {
            waitingForSelectionKeyboard.stopMoveDrawingWithKeyboard();
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.SomethingHasBeenSelected);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });

        it('should clear the window interval if intervalRef is defined', () => {
            selectionServiceSpy.intervalRef = {} as NodeJS.Timeout;
            const clearIntervalSpy = spyOn<any>(window, 'clearInterval');
            waitingForSelectionKeyboard.stopMoveDrawingWithKeyboard();
            expect(clearIntervalSpy).toHaveBeenCalled();
        });
    });
});
