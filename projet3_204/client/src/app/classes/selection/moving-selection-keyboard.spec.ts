import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { MovingSelectionByKeyboard } from './moving-selection-keyboard';
import { SelectionManager } from './selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-empty
// tslint:disable: no-any
describe('MovingSelectionByKeyboard', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let movingSelectionByKeyboard: MovingSelectionByKeyboard;

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

        movingSelectionByKeyboard = new MovingSelectionByKeyboard(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);
    });

    describe('updateView()', () => {
        it('should should call drawPerimiter()', () => {
            selectionServiceSpy.initialPositionBeforeMove = new Vec2(0, 0);
            selectionServiceSpy.mousePosition = new Vec2(0, 0);
            selectionServiceSpy.mouseDownPosition = new Vec2(0, 0);
            movingSelectionByKeyboard.updateView();
            expect(selectionManagerSpy.drawPerimiter).toHaveBeenCalled();
        });

        it('should move the drawing to the top left is the arrow up and arrow left buttons are pressed', () => {
            selectionServiceSpy.arrowsPressed = new Map([
                [KeyboardButton.ArrowLeft, true],
                [KeyboardButton.ArrowRight, false],
                [KeyboardButton.ArrowUp, true],
                [KeyboardButton.ArrowDown, false],
            ]);
            selectionServiceSpy.topLeftCorner = new Vec2(50, 50);
            movingSelectionByKeyboard.moveDrawingWithKeyboard();
            expect(selectionServiceSpy.topLeftCorner.x).not.toEqual(50);
            expect(selectionServiceSpy.topLeftCorner.y).not.toEqual(50);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });

        it('should move the drawing to the bottom right is the arrow down and arrow right buttons are pressed', () => {
            selectionServiceSpy.arrowsPressed = new Map([
                [KeyboardButton.ArrowLeft, false],
                [KeyboardButton.ArrowRight, true],
                [KeyboardButton.ArrowUp, false],
                [KeyboardButton.ArrowDown, true],
            ]);
            selectionServiceSpy.topLeftCorner = new Vec2(50, 50);
            movingSelectionByKeyboard.moveDrawingWithKeyboard();
            expect(selectionServiceSpy.topLeftCorner.x).not.toEqual(50);
            expect(selectionServiceSpy.topLeftCorner.y).not.toEqual(50);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('stopMoveDrawingWithKeyboard()', () => {
        it('should update the view and setting the correct state', () => {
            movingSelectionByKeyboard.stopMoveDrawingWithKeyboard();
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.SomethingHasBeenSelected);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });

        it('should clear the interval Ref if it is set', () => {
            const clearIntervalSpy = spyOn<any>(window, 'clearInterval').and.callThrough();
            selectionServiceSpy.intervalRef = setInterval(() => {}, 10000);
            movingSelectionByKeyboard.stopMoveDrawingWithKeyboard();
            expect(clearIntervalSpy).toHaveBeenCalled();
        });
    });

    describe('resetKeyBoardMove()', () => {
        it('should set do nothing if firstKeyBoardMove is true', () => {
            movingSelectionByKeyboard['firstKeyBoardMove'] = true;
            movingSelectionByKeyboard.resetKeyBoardMove();
            expect(movingSelectionByKeyboard['firstKeyBoardMove']).toBeTrue();
        });

        it('should set firstKeyBoardMove to true if its false', () => {
            movingSelectionByKeyboard['firstKeyBoardMove'] = false;
            movingSelectionByKeyboard.resetKeyBoardMove();
            expect(movingSelectionByKeyboard['firstKeyBoardMove']).toBeTrue();
        });
    });

    describe('setTranslation()', () => {
        it('should set parameters depending on context and call resetTopLeftPosition', () => {
            selectionServiceSpy.topLeftCorner = new Vec2(50, 50);
            const spy = spyOn<any>(movingSelectionByKeyboard, 'resetTopLeftPosition').and.callThrough();
            movingSelectionByKeyboard['setTranslation']();
            expect(spy).toHaveBeenCalled();
        });

        it('should not call resetTopLeftPosition if one parameter has changed since the last call', () => {
            movingSelectionByKeyboard['firstKeyBoardMove'] = false;
            selectionServiceSpy.topLeftCorner = new Vec2(50, 50);
            const spy = spyOn<any>(movingSelectionByKeyboard, 'resetTopLeftPosition').and.callThrough();
            movingSelectionByKeyboard['setTranslation']();
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
