import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { PrototypeSelection } from './prototype-selection';
import { SelectionManager } from './selection-manager';
// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
describe('PrototypeSelection', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let prototypeSelection: PrototypeSelection;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(async () => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', ['updateView', 'getImageData', 'updateShapeDataResizing', 'drawPerimiter']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse']);
        selectionServiceSpy.toolActionData = new SelectionActionData();

        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawServiceSpy.canvas = canvasTestHelper.canvas;

        prototypeSelection = new PrototypeSelection(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);
    });

    describe('onMouseUp()', () => {
        it('should reset the selection state to nothing if the mouse has not moved since pressing down', async () => {
            prototypeSelection['selectionService'].mouseDownPosition = new Vec2(0, 0);
            prototypeSelection['selectionService'].mousePosition = new Vec2(0, 0);
            await prototypeSelection.onMouseUp({} as MouseEvent);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.Nothing);
        });

        it('should assign the selection state to somethingHasBeenSelected on a sucessful creation of a selection', async () => {
            selectionServiceSpy.mouseDownPosition = new Vec2(0, 0);
            selectionServiceSpy.mousePosition = new Vec2(5, 0);
            await prototypeSelection.onMouseUp({} as MouseEvent);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.SomethingHasBeenSelected);
        });
    });

    describe('onMouseMove()', () => {
        it('should exit if the tool is outside the canvas', async () => {
            selectionServiceSpy.isOutsideCanvas = true;
            prototypeSelection.onMouseMove({} as MouseEvent);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });

        it('should update the view', async () => {
            selectionServiceSpy.isOutsideCanvas = false;
            prototypeSelection.onMouseMove({} as MouseEvent);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('updateView()', () => {
        it('should call drawPerimiter()', () => {
            prototypeSelection.updateView();
            expect(selectionManagerSpy.drawPerimiter).toHaveBeenCalled();
        });
    });

    describe('calculateIntersectionPoint', () => {
        it('should return the a point within the canvas width if input is beyond it', () => {
            expect(
                prototypeSelection['calculateIntersectionPoint'](new Vec2(99999, 0)).equals(new Vec2(canvasTestHelper.canvas.width, 0)),
            ).toBeTrue();
        });

        it('should return the a point within the canvas height if input is beyond it', () => {
            expect(
                prototypeSelection['calculateIntersectionPoint'](new Vec2(0, 999999)).equals(new Vec2(0, canvasTestHelper.canvas.height)),
            ).toBeTrue();
        });
    });
});
