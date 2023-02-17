import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { Vec2 } from '@app/classes/vec2';
import { SelectionButtonPosition, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ResizingSelection } from './resize-selection';
import { SelectionManager } from './selection-manager';
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
describe('ResizingSelection', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;

    let resizingSelection: ResizingSelection;

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
        selectionServiceSpy.toolActionData = new SelectionActionData();
        TestBed.configureTestingModule({});

        resizingSelection = new ResizingSelection(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);

        const topLeft = new Vec2(1, 1);
        const initialWidth = 10;
        const initialHeight = 10;

        selectionServiceSpy.topLeftCorner = topLeft;
        selectionServiceSpy.initialWidthBeforeReize = initialWidth;
        selectionServiceSpy.initialHeightBeforeReize = initialHeight;

        //  selectionServiceSpy.toolActionData.newSelectionTopLeftCorner = topLeft;
    });

    describe('onMouseUp()', () => {
        it('should call updateView() and set the appropriate selectionState', async () => {
            await resizingSelection.onMouseUp({} as MouseEvent);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.SomethingHasBeenSelected);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('onMouseMove()', () => {
        it('should call updateView()', () => {
            resizingSelection.onMouseMove({} as MouseEvent);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('updateView()', () => {
        it('should should call drawPerimiter()', () => {
            const initialPos = new Vec2(11, 11);
            const mousePos = new Vec2(11, 16);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.BottomRight;

            selectionServiceSpy.shiftDown = true;

            resizingSelection.updateView();

            expect(selectionServiceSpy.toolActionData.newSelectionHeight).toEqual(10);
            expect(selectionManagerSpy.drawPerimiter).toHaveBeenCalled();
        });

        it('should should call drawPerimiter()', () => {
            const initialPos = new Vec2(11, 11);
            const mousePos = new Vec2(11, 16);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.BottomRight;

            selectionServiceSpy.shiftDown = false;

            resizingSelection.updateView();

            expect(selectionServiceSpy.toolActionData.newSelectionHeight).toEqual(15);
            expect(selectionManagerSpy.drawPerimiter).toHaveBeenCalled();
        });
    });

    describe('resizeDrawing()', () => {
        it('should move TopLeft button', () => {
            const initialPos = new Vec2(1, 1);
            const mousePos = new Vec2(2, 2);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.TopLeft;

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(mousePos);
        });

        it('should move TopMiddle button', () => {
            const initialPos = new Vec2(6, 1);
            const mousePos = new Vec2(6, 2);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.TopMiddle;

            const result = new Vec2(selectionServiceSpy.topLeftCorner.x, mousePos.y);

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(result);
        });

        it('should move TopRight button', () => {
            const initialPos = new Vec2(11, 1);
            const mousePos = new Vec2(11, 2);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.TopRight;

            const result = new Vec2(selectionServiceSpy.topLeftCorner.x, mousePos.y);

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(result);
        });

        it('should move MiddleLeft button', () => {
            const initialPos = new Vec2(1, 6);
            const mousePos = new Vec2(3, 6);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.MiddleLeft;

            const result = new Vec2(mousePos.x, selectionServiceSpy.topLeftCorner.y);

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(result);
        });

        it('should move MiddleRight button', () => {
            const initialPos = new Vec2(11, 6);
            const mousePos = new Vec2(13, 6);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.MiddleRight;

            const result = new Vec2(selectionServiceSpy.topLeftCorner);

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(result);
        });

        it('should move BottomLeft button', () => {
            const initialPos = new Vec2(1, 11);
            const mousePos = new Vec2(2, 15);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.BottomLeft;

            const result = new Vec2(mousePos.x, selectionServiceSpy.topLeftCorner.y);

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(result);
        });

        it('should move BottomMiddle button', () => {
            const initialPos = new Vec2(6, 11);
            const mousePos = new Vec2(6, 15);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.BottomMiddle;

            const result = new Vec2(selectionServiceSpy.topLeftCorner);

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(result);
        });

        it('should move BottomRight button', () => {
            const initialPos = new Vec2(11, 11);
            const mousePos = new Vec2(15, 15);

            selectionServiceSpy.initialPositionBeforeMove = initialPos;
            selectionServiceSpy.mousePosition = mousePos;
            selectionServiceSpy.mouseDownPosition = initialPos;

            selectionServiceSpy.buttonCurrentlyMoving = SelectionButtonPosition.BottomRight;

            const result = new Vec2(selectionServiceSpy.topLeftCorner);

            resizingSelection['resizeDrawing']();
            expect(selectionServiceSpy.toolActionData.newSelectionTopLeftCorner).toEqual(result);
        });
    });
});
