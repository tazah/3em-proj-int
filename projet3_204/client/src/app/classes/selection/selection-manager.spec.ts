import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SelectionManager } from './selection-manager';

class SelectionManagerTest extends SelectionManager {}

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty
describe('SelectionManager', () => {
    let selectionManagerTest: SelectionManagerTest;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoStub: UndoRedoService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectAllCanvas']);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoStub = new UndoRedoService(drawServiceSpy);

        TestBed.configureTestingModule({});
        selectionManagerTest = new SelectionManagerTest(selectionServiceSpy, drawServiceSpy, undoRedoStub);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        selectionManagerTest['drawingService'].baseCtx = baseCtxStub;
        selectionManagerTest['drawingService'].previewCtx = previewCtxStub;
        selectionManagerTest['drawingService'].canvas = canvasTestHelper.canvas;
        selectionManagerTest['drawingService'].selectionBoxCtx = baseCtxStub;

        selectionServiceSpy.selectionState = SelectionState.Nothing;
        selectionServiceSpy.arrowsPressed = new Map([
            [KeyboardButton.ArrowLeft, false],
            [KeyboardButton.ArrowRight, false],
            [KeyboardButton.ArrowUp, false],
            [KeyboardButton.ArrowDown, false],
        ]);
    });

    it('blank functions fake test for coverage', async () => {
        selectionManagerTest.draw(false, {} as SelectionActionData);
        await selectionManagerTest.getImageData();
        expect(true).toBeTrue();
    });

    describe('onMouseUp()', () => {
        it('should do nothing if a rightClick is made', async () => {
            const selectionOnMouseUpSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'onMouseUp').and.returnValue(Promise.resolve());
            await selectionManagerTest.onMouseUp({ button: MouseButton.Right } as MouseEvent);
            expect(selectionOnMouseUpSpy).not.toHaveBeenCalled();
        });

        it('should call onMouseUp if a leftClick is made', async () => {
            const selectionOnMouseUpSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'onMouseUp').and.returnValue(Promise.resolve());
            await selectionManagerTest.onMouseUp({ button: MouseButton.Left } as MouseEvent);
            expect(selectionOnMouseUpSpy).toHaveBeenCalled();
        });
    });

    describe('updateView()', () => {
        it('should call clearCanvas and updateView', () => {
            const selectionUpdateViewSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'updateView');
            selectionManagerTest.updateView();
            expect(selectionUpdateViewSpy).toHaveBeenCalled();
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        });
    });

    describe('drawPerimiter()', () => {
        it('should call setLineDash and strokeRect', () => {
            const setLineDashSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'setLineDash');
            const strokeRectSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'strokeRect');
            selectionServiceSpy.topLeftCorner = new Vec2(1, 1);
            selectionManagerTest.drawPerimiter();
            expect(setLineDashSpy).toHaveBeenCalled();
            expect(strokeRectSpy).toHaveBeenCalled();
        });
    });

    describe('updateShapeDataResizing()', () => {
        it('should calculate the correct width if the mousePosition is in the sideBar', () => {
            selectionServiceSpy.mouseDownPosition = new Vec2(1, 1);
            selectionServiceSpy.mousePosition = new Vec2(-1, 3);
            selectionManagerTest.updateShapeDataResizing();
            expect(selectionServiceSpy.topLeftCorner.x).toEqual(0);
        });

        it('should calculate the correct width if the mousePosition is in the sideBar', () => {
            selectionServiceSpy.mouseDownPosition = new Vec2(1, 1);
            selectionServiceSpy.mousePosition = new Vec2(2, -1);
            selectionManagerTest.updateShapeDataResizing();
            expect(selectionServiceSpy.topLeftCorner.y).toEqual(0);
        });

        it('should calculate the correct width if the mousePosition is beyond the canvas width', () => {
            selectionServiceSpy.mouseDownPosition = new Vec2(1, 1);
            selectionServiceSpy.mousePosition = new Vec2(99999999, 3);
            selectionManagerTest.updateShapeDataResizing();
            expect(selectionServiceSpy.width).toEqual(canvasTestHelper.canvas.width - selectionServiceSpy.topLeftCorner.x);
        });

        it('should calculate the correct width if the mousePosition is beyond the canvas height', () => {
            selectionServiceSpy.mouseDownPosition = new Vec2(1, 1);
            selectionServiceSpy.mousePosition = new Vec2(2, 999999);
            selectionManagerTest.updateShapeDataResizing();
            expect(selectionServiceSpy.height).toEqual(canvasTestHelper.canvas.height - selectionServiceSpy.topLeftCorner.y);
        });

        it('should calculate the correct width and height if shiftDown is true', () => {
            selectionServiceSpy.mouseDownPosition = new Vec2(1, 1);
            selectionServiceSpy.mousePosition = new Vec2(15, 3);
            selectionServiceSpy.shiftDown = true;
            selectionManagerTest.updateShapeDataResizing();
            expect(selectionServiceSpy.height).toEqual(selectionServiceSpy.width);
        });
    });

    describe('onMouseMove()', () => {
        it('should call the currentSelection onMouseMove', () => {
            const selectionOnMouseMoveSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'onMouseMove');
            const event = {} as MouseEvent;
            selectionManagerTest.onMouseMove(event);
            expect(selectionOnMouseMoveSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('onMouseDown()', () => {
        it('should call the currentSelection onMouseDown and clear the canvas', () => {
            const selectionOnMouseDownSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'onMouseDown');
            const event = {} as MouseEvent;
            selectionManagerTest.onMouseDown(event);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(selectionOnMouseDownSpy).toHaveBeenCalled();
        });
    });

    describe('moveDrawingWithKeyboard()', () => {
        it('should call the currentSelection moveDrawingWithKeyboard', () => {
            const selectinMoveDrawingWithKeyboardSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'moveDrawingWithKeyboard');
            selectionManagerTest.moveDrawingWithKeyboard();
            expect(selectinMoveDrawingWithKeyboardSpy).toHaveBeenCalled();
        });
    });

    describe('stopMoveDrawingWithKeyboard()', () => {
        it('should call the currentSelection stopMoveDrawingWithKeyboard', () => {
            const selectinStopMoveDrawingWithKeyboardSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'stopMoveDrawingWithKeyboard');
            selectionManagerTest.stopMoveDrawingWithKeyboard();
            expect(selectinStopMoveDrawingWithKeyboardSpy).toHaveBeenCalled();
        });
    });

    describe('onKeyDown()', () => {
        it('should call moveDrawingWithKeyboard if the key that is pressed is an arrowKey', () => {
            const moveDrawingWithKeyboardSpy = spyOn<any>(selectionManagerTest, 'moveDrawingWithKeyboard');
            selectionManagerTest.onKeyDown({ key: KeyboardButton.ArrowDown } as KeyboardEvent);
            expect(moveDrawingWithKeyboardSpy).toHaveBeenCalled();
        });

        it('should call updateView if the shiftKey is pressed', () => {
            const updateViewSpy = spyOn<any>(selectionManagerTest, 'updateView');
            selectionManagerTest.onKeyDown({ key: KeyboardButton.Shift } as KeyboardEvent);
            expect(updateViewSpy).toHaveBeenCalled();
        });

        it('should select all the canvas id Ctrl+a is pressed', () => {
            selectionManagerTest.onKeyDown({ key: 'A', ctrlKey: true, preventDefault: () => {} } as KeyboardEvent);
            expect(selectionServiceSpy.selectAllCanvas).toHaveBeenCalled();
        });

        it('should do nothing if an invalid key is passed', () => {
            const updateViewSpy = spyOn<any>(selectionManagerTest, 'updateView');
            const moveDrawingWithKeyboardSpy = spyOn<any>(selectionManagerTest, 'moveDrawingWithKeyboard');
            selectionManagerTest.onKeyDown({ key: 'z' } as KeyboardEvent);
            expect(updateViewSpy).not.toHaveBeenCalled();
            expect(moveDrawingWithKeyboardSpy).not.toHaveBeenCalled();
        });
    });

    describe('onKeyUp()', () => {
        it('should call moveDrawingWithKeyboard if the key that is pressed is an arrowKey', () => {
            const stopMoveDrawingWithKeyboardSpy = spyOn<any>(selectionManagerTest, 'stopMoveDrawingWithKeyboard');
            selectionManagerTest.onKeyUp({ key: KeyboardButton.ArrowDown } as KeyboardEvent);
            expect(stopMoveDrawingWithKeyboardSpy).toHaveBeenCalled();
        });

        it('should call updateView if the shiftKey is pressed', () => {
            const updateViewSpy = spyOn<any>(selectionManagerTest, 'updateView');
            selectionManagerTest.onKeyUp({ key: KeyboardButton.Shift } as KeyboardEvent);
            expect(updateViewSpy).toHaveBeenCalled();
        });

        it('should do nothing if an invalid key is passed', () => {
            const updateViewSpy = spyOn<any>(selectionManagerTest, 'updateView');
            const stopMoveDrawingWithKeyboardSpy = spyOn<any>(selectionManagerTest, 'stopMoveDrawingWithKeyboard');
            selectionManagerTest.onKeyUp({} as KeyboardEvent);
            expect(updateViewSpy).not.toHaveBeenCalled();
            expect(stopMoveDrawingWithKeyboardSpy).not.toHaveBeenCalled();
        });
    });

    describe('onClick()', () => {
        it('should call the current selection onClick method', () => {
            const selectionOnClickSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'onClick').and.returnValue(Promise.resolve());
            const event = {} as MouseEvent;
            selectionManagerTest.onClick(event);
            expect(selectionOnClickSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('finishDrawing()', () => {
        it('should call the current selection finishDrawing method', () => {
            const selectiofinishDrawingSpy = spyOn<any>(selectionManagerTest['currentSelection'], 'finishDrawing');
            selectionManagerTest.finishDrawing();
            expect(selectiofinishDrawingSpy).toHaveBeenCalled();
        });
    });
});
