import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { NothingSelectionLasso } from './nothing-selection-lasso';
import { SelectionManager } from './selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
describe('NothingSelection', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let nothingSelectionLasso: NothingSelectionLasso;

    beforeEach(async () => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', ['updateView', 'getImageData', 'updateShapeDataResizing', 'drawPerimiter']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse']);

        TestBed.configureTestingModule({});

        nothingSelectionLasso = new NothingSelectionLasso(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);

        selectionServiceSpy.toolActionData = new SelectionActionData();
    });

    describe('onClick()', () => {
        it('should call empty the pathData and only add the mousePosition', async () => {
            selectionServiceSpy.mousePosition = new Vec2(0, 0);
            await nothingSelectionLasso.onClick({} as MouseEvent);
            expect(selectionServiceSpy.toolActionData.pathData).toEqual([selectionServiceSpy.mousePosition]);
        });
    });

    describe('onMouseDown()', () => {
        it('should do nothing', () => {
            nothingSelectionLasso.onMouseDown({} as MouseEvent);
            expect(true).toBe(true);
        });
    });
});
