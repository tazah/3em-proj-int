import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { MovingSelectionByMouse } from './moving-selection-mouse';
import { SelectionManager } from './selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('MovingSelectionByMouse', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let movingSelectionByMouse: MovingSelectionByMouse;

    beforeEach(async () => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', [
            'updateView',
            'getImageData',
            'updateShapeDataResizing',
            'drawPerimiter',
            'draw',
        ]);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse', 'updateControlPointsPositions']);

        TestBed.configureTestingModule({});

        movingSelectionByMouse = new MovingSelectionByMouse(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);
    });

    describe('onMouseUp()', () => {
        it('should call updateView() and set the appropriate selectionState', async () => {
            await movingSelectionByMouse.onMouseUp({} as MouseEvent);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.SomethingHasBeenSelected);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('onMouseMove()', () => {
        it('should call updateView()', () => {
            movingSelectionByMouse.onMouseMove({} as MouseEvent);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('updateView()', () => {
        it('should should call drawPerimiter()', () => {
            selectionServiceSpy.initialPositionBeforeMove = new Vec2(0, 0);
            selectionServiceSpy.mousePosition = new Vec2(0, 0);
            selectionServiceSpy.mouseDownPosition = new Vec2(0, 0);
            movingSelectionByMouse.updateView();
            expect(selectionManagerSpy.drawPerimiter).toHaveBeenCalled();
        });
    });
});
