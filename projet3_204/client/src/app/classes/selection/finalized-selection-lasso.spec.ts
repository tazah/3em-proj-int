import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { Vec2 } from '@app/classes/vec2';
import { SelectionButtonPosition, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { FinalizedSelection } from './finalized-selection';
import { FinalizedSelectionLasso } from './finalized-selection-lasso';
import { SelectionManager } from './selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
describe('FinalizedSelection', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let finalizedSelectionLasso: FinalizedSelectionLasso;

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
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse']);

        TestBed.configureTestingModule({});

        finalizedSelectionLasso = new FinalizedSelectionLasso(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);
        selectionServiceSpy.toolActionData = new SelectionActionData();
        selectionServiceSpy.buttonPos = [];
        selectionServiceSpy.buttonPos[SelectionButtonPosition.TopLeft] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.TopMiddle] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.TopRight] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.MiddleLeft] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.MiddleRight] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.BottomLeft] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.BottomMiddle] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.BottomRight] = new Vec2(0, 0);
        selectionServiceSpy.toolActionData.newSelectionWidth = 0;
        selectionServiceSpy.toolActionData.newSelectionHeight = 0;
    });

    describe('onMouseUp()', () => {
        it('should do nothing', async () => {
            await finalizedSelectionLasso.onMouseUp({} as MouseEvent);
            expect(true).toBe(true);
        });
    });

    describe('onMouseDown()', () => {
        it('should set the state to ResizingSelection if onw of the resizeButtons are pressed', () => {
            finalizedSelectionLasso.onMouseDown({} as MouseEvent, false, true, SelectionButtonPosition.BottomLeft);
            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.ResizingSelection);
        });

        it('should do nothing if isOverSelection is false', () => {
            finalizedSelectionLasso.onMouseDown({} as MouseEvent, false);
            expect(selectionServiceSpy.getPositionFromMouse).not.toHaveBeenCalled();
        });

        it('should change the selectionState and call getPositionFromMouse', () => {
            selectionServiceSpy.topLeftCorner = new Vec2(0, 0);
            finalizedSelectionLasso.onMouseDown({} as MouseEvent, true, false);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.MovingSelectionMouse);
            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
        });
    });

    describe('onClick()', () => {
        it('should return the parent class MouseUp', async () => {
            const onMouseUpSpy = spyOn(FinalizedSelection.prototype, 'onMouseUp').and.returnValue(Promise.resolve());
            await finalizedSelectionLasso.onClick({} as MouseEvent);
            expect(onMouseUpSpy).toHaveBeenCalled();
        });
    });
});
