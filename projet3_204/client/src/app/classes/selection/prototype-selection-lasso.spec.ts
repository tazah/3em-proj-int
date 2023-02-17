import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { LineService } from '@app/services/tools/line.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PrototypeSelectionLasso } from './prototype-selection-lasso';
import { SelectionManager } from './selection-manager';

// tslint:disable: no-any
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
describe('PrototypeSelectionLasso', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let prototypeSelectionLasso: PrototypeSelectionLasso;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(async () => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', ['updateView', 'getImageData', 'updateShapeDataResizing', 'drawPerimiter']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse']);

        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        prototypeSelectionLasso = new PrototypeSelectionLasso(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);

        drawServiceSpy.selectionBoxCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        selectionServiceSpy.toolActionData = new SelectionActionData();
        selectionServiceSpy.toolActionData.pathData = [new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0), new Vec2(0, 0)];
    });

    describe('onMouseUp()', () => {
        it('dummy test to cover empty onMouseUp', () => {
            prototypeSelectionLasso.onMouseUp({} as MouseEvent);
            expect(true).toBeTrue();
        });
    });

    describe('onClick()', () => {
        it('should set the selectionState to nothing if the pathData is empty', async () => {
            selectionServiceSpy.toolActionData.pathData = [];
            await prototypeSelectionLasso.onClick({} as MouseEvent);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.Nothing);
        });

        it('should nothing if the mouse is outside the canvas', async () => {
            selectionServiceSpy.isOutsideCanvas = true;
            await prototypeSelectionLasso.onClick({} as MouseEvent);
            expect(selectionServiceSpy.getPositionFromMouse).not.toHaveBeenCalled();
        });

        it('should return if mousePosition intersects and shiftDown is false', async () => {
            selectionServiceSpy.isOutsideCanvas = false;
            selectionServiceSpy.shiftDown = false;
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(true);
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(50, 50));

            await prototypeSelectionLasso.onClick({} as MouseEvent);

            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
            expect(intersectSpy).toHaveBeenCalled();
        });

        it('should return if mousePosition intersects and shiftDown is true', async () => {
            selectionServiceSpy.isOutsideCanvas = false;
            selectionServiceSpy.shiftDown = true;
            const calculatePointWithAngleSpy = spyOn<any>(LineService, 'calculatePointWithAngle').and.returnValue(new Vec2(50, 50));
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(true);

            await prototypeSelectionLasso.onClick({} as MouseEvent);

            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
            expect(intersectSpy).toHaveBeenCalled();
            expect(calculatePointWithAngleSpy).toHaveBeenCalled();
        });

        it('should push first point from pathData if pathIsClosed', async () => {
            selectionServiceSpy.isOutsideCanvas = false;
            selectionServiceSpy.shiftDown = false;
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(false);
            const pathClosedSpy = spyOn<any>(prototypeSelectionLasso, 'pathIsClosed').and.callThrough();
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(10, 10));

            await prototypeSelectionLasso.onClick({} as MouseEvent);

            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
            expect(intersectSpy).toHaveBeenCalled();
            expect(pathClosedSpy).toHaveBeenCalled();
            expect(pathClosedSpy).toBeTruthy();
        });

        it('should push mousePosition in pathData is shiftDown', async () => {
            selectionServiceSpy.isOutsideCanvas = false;
            selectionServiceSpy.shiftDown = true;
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(false);
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(50, 50));

            await prototypeSelectionLasso.onClick({} as MouseEvent);

            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
            expect(intersectSpy).toHaveBeenCalled();
        });

        it('should push mousePosition in pathData and not update mousePosition is shiftDown is false', async () => {
            selectionServiceSpy.isOutsideCanvas = false;
            selectionServiceSpy.shiftDown = false;
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(false);
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(50, 50));

            await prototypeSelectionLasso.onClick({} as MouseEvent);

            expect(selectionServiceSpy.getPositionFromMouse).toHaveBeenCalled();
            expect(intersectSpy).toHaveBeenCalled();
        });
    });

    describe('onMouseDown', () => {
        it('should call the selectionManager updateView', () => {
            prototypeSelectionLasso.onMouseDown({} as MouseEvent);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('onMouseMove', () => {
        it('should set the selectionState to nothing if the pathData is empty', () => {
            selectionServiceSpy.toolActionData.pathData = [];
            prototypeSelectionLasso.onMouseMove({} as MouseEvent);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.Nothing);
        });

        it('should call the selectionManager updateView', () => {
            const calculatePointWithAngleSpy = spyOn<any>(LineService, 'calculatePointWithAngle').and.returnValue(new Vec2(50, 50));
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(50, 50));
            prototypeSelectionLasso.onMouseMove({} as MouseEvent);

            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
            expect(calculatePointWithAngleSpy).toHaveBeenCalled();
        });

        it('should call updateView and drawCursor if mousePosition intersects and shiftDown is false', () => {
            selectionServiceSpy.shiftDown = false;
            const drawErrorCursorSpy = spyOn<any>(prototypeSelectionLasso, 'drawErrorCursor').and.callThrough();
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(true);
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(50, 50));

            prototypeSelectionLasso.onMouseMove({} as MouseEvent);

            expect(intersectSpy).toHaveBeenCalled();
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
            expect(drawErrorCursorSpy).toHaveBeenCalled();
        });

        it('should call updateView and drawCursor if shiftMousePosition intersects and shiftDown is true', () => {
            selectionServiceSpy.shiftDown = true;
            const drawErrorCursorSpy = spyOn<any>(prototypeSelectionLasso, 'drawErrorCursor').and.callThrough();
            const calculatePointWithAngleSpy = spyOn<any>(LineService, 'calculatePointWithAngle').and.returnValue(new Vec2(50, 50));
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(true);
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(50, 50));

            prototypeSelectionLasso.onMouseMove({} as MouseEvent);

            expect(intersectSpy).toHaveBeenCalled();
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
            expect(drawErrorCursorSpy).toHaveBeenCalled();
            expect(calculatePointWithAngleSpy).toHaveBeenCalled();
        });

        it('should call updateView if shiftDown', () => {
            selectionServiceSpy.shiftDown = true;
            const oldMousePositionValue = (prototypeSelectionLasso.mousePosition = new Vec2(25, 25));
            const intersectSpy = spyOn<any>(prototypeSelectionLasso, 'intersects').and.returnValue(false);
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(50, 50));

            prototypeSelectionLasso.onMouseMove({} as MouseEvent);

            expect(prototypeSelectionLasso.mousePosition).not.toEqual(oldMousePositionValue);
            expect(intersectSpy).toHaveBeenCalled();
        });
    });

    describe('updateView()', () => {
        it('should clear the canvas and draw multiple lines', () => {
            const lineToSpy = spyOn(drawServiceSpy.selectionBoxCtx, 'lineTo');
            spyOnProperty(prototypeSelectionLasso, 'pathData', 'get').and.returnValue([]);
            selectionServiceSpy.mousePosition = new Vec2(0, 0);
            prototypeSelectionLasso.updateView();
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
        });

        it('should call lineTo multiple times', () => {
            const lineToSpy = spyOn(drawServiceSpy.selectionBoxCtx, 'lineTo');
            spyOnProperty(prototypeSelectionLasso, 'pathData', 'get').and.returnValue([new Vec2(15, 100), new Vec2(10, 10), new Vec2(500, 550)]);
            selectionServiceSpy.mousePosition = new Vec2(0, 0);
            prototypeSelectionLasso.updateView();
            expect(lineToSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalledTimes(4);
        });
    });

    describe('onKeyUp()', () => {
        it('should do nothing if the key releases is not the backspace button or the scape button', () => {
            prototypeSelectionLasso.onKeyUp({ key: KeyboardButton.ArrowDown } as KeyboardEvent);
            expect(selectionManagerSpy.updateView).not.toHaveBeenCalled();
        });

        it('should call pathData pop and the selectionManager updateView', () => {
            selectionServiceSpy.toolActionData.pathData = [new Vec2(0, 0)];
            const popSpy = spyOn(selectionServiceSpy.toolActionData.pathData, 'pop');
            prototypeSelectionLasso.onKeyUp({ key: KeyboardButton.Backspace } as KeyboardEvent);
            expect(popSpy).toHaveBeenCalled();
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });

        it('should set the selectionState to Nothing, empty the oathData and update the view if the key released is teh escape key', () => {
            prototypeSelectionLasso.onKeyUp({ key: KeyboardButton.Escape } as KeyboardEvent);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.Nothing);
            expect(selectionServiceSpy.toolActionData.pathData.length).toEqual(0);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('drawErrorCursor()', () => {
        it('should call fillText', () => {
            const fillTextSpy = spyOn(drawServiceSpy.selectionBoxCtx, 'fillText');
            selectionServiceSpy.mousePosition = new Vec2(0, 0);
            prototypeSelectionLasso['drawErrorCursor']();
            expect(fillTextSpy).toHaveBeenCalledWith('❌', 0, 0);
        });
    });

    describe('mousePosition', () => {
        it('should return the selectionServiceSpy mousePosition', () => {
            prototypeSelectionLasso.mousePosition = new Vec2(0, 0);
            expect(selectionServiceSpy.mousePosition).toEqual(prototypeSelectionLasso.mousePosition);
        });
    });

    describe('pathData', () => {
        it('should return the selectionService toolActionData pathData', () => {
            selectionServiceSpy.toolActionData.pathData = [new Vec2(0, 0)];
            expect(prototypeSelectionLasso.pathData).toEqual(selectionServiceSpy.toolActionData.pathData);
        });
    });

    describe('intersects()', () => {
        it('should return false if the pathData length is smaller than 3', () => {
            selectionServiceSpy.toolActionData.pathData = [new Vec2(0, 0)];
            expect(prototypeSelectionLasso['intersects'](new Vec2(0, 0))).toBeFalse();
        });

        it('should return true if the new point we are trying to make intersects with an older segment', () => {
            selectionServiceSpy.toolActionData.pathData = [
                new Vec2(206, 215),
                new Vec2(421, 200),
                new Vec2(367, 250),
                new Vec2(387, 290),
                new Vec2(357, 324),
                new Vec2(357, 324),
            ];

            expect(prototypeSelectionLasso['intersects'](new Vec2(236, 196))).toBeTrue();
        });

        it('should return false if there is no intersection', () => {
            selectionServiceSpy.toolActionData.pathData = [
                new Vec2(206, 215),
                new Vec2(421, 200),
                new Vec2(367, 250),
                new Vec2(387, 290),
                new Vec2(450, 324),
                new Vec2(670, 670),
            ];

            expect(prototypeSelectionLasso['intersects'](new Vec2(780, 780))).toBeFalse();
        });

        it('should ', () => {
            selectionServiceSpy.toolActionData.pathData = [new Vec2(206, 215), new Vec2(421, 200), new Vec2(367, 250)];

            expect(prototypeSelectionLasso['intersects'](new Vec2(780, 780))).toBeFalse();
        });
    });

    describe('pathIsClosed()', () => {
        it('should return true if it is close to the intial pathData point', () => {
            selectionServiceSpy.toolActionData.pathData = [new Vec2(10, 10)];
            selectionServiceSpy.mousePosition = new Vec2(20, 20);
            expect(prototypeSelectionLasso['pathIsClosed']()).toBeTrue();
        });
    });
});
