import { TestBed } from '@angular/core/testing';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { NothingSelection } from './nothing-selection';
import { SelectionManager } from './selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
describe('NothingSelection', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let nothingSelection: NothingSelection;

    beforeEach(async () => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', ['updateView', 'getImageData', 'updateShapeDataResizing', 'drawPerimiter']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse']);

        TestBed.configureTestingModule({});

        nothingSelection = new NothingSelection(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);
    });

    describe('onMouseDown()', () => {
        it('should call getPositionFromMouse', () => {
            nothingSelection.onMouseDown({} as MouseEvent);
            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
        });
    });
});
