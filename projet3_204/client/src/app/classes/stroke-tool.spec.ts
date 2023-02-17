import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { BLACK, WHITE } from '@app/constants/color.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Color } from './color';
import { StrokeTool } from './stroke-tool';

// tslint:disable
class StrokeToolTest extends StrokeTool {
    constructor(drawingService: DrawingService, colorService: ColorService, undoRedoService: UndoRedoService) {
        super(drawingService, colorService, undoRedoService);
    }
}

describe('StrokeToolTest', () => {
    let strokeToolTest: StrokeToolTest;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let drawSpy: jasmine.Spy<any>;
    let onMouseUpSpy: jasmine.Spy<any>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['update']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);

        colorServiceSpy.primaryColor = new Color(BLACK);
        colorServiceSpy.secondaryColor = new Color(WHITE);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        strokeToolTest = new StrokeToolTest(drawServiceSpy, colorServiceSpy, undoRedoServiceSpy);
        drawSpy = spyOn<any>(strokeToolTest, 'draw').and.callThrough();
        onMouseUpSpy = spyOn<any>(strokeToolTest, 'onMouseUp').and.callThrough();

        strokeToolTest.isOutsideCanvas = false;
        strokeToolTest['drawingService'].baseCtx = baseCtxStub;
        strokeToolTest['drawingService'].previewCtx = previewCtxStub;
        strokeToolTest['drawingService'].canvas = canvasStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            x: 30,
            y: 25,
            button: 0,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(strokeToolTest).toBeTruthy();
    });

    it('Should exit onMouseDown if it was not made with leftClick', () => {
        strokeToolTest.onMouseDown({} as MouseEvent);
        expect(strokeToolTest['pathData'].length).toEqual(0);
    });

    it('onMouseMove, changes mouseDownCoord if mouseDown is true', () => {
        const event = { x: 25, y: 25, buttons: 1, target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        strokeToolTest.mouseDown = true;
        strokeToolTest.isOutsideCanvas = true;

        strokeToolTest['mousePosition'] = new Vec2(-1, -1);
        strokeToolTest['lastInsidePosition'] = new Vec2(2, 2);
        strokeToolTest.onMouseMove(event);

        expect(strokeToolTest['mousePosition'].equals(new Vec2(-1, -1))).toBeFalse();
    });

    it('onMouseMove, onMouseUp is called if no buttons are pressed', () => {
        const event = { x: 25, y: 25, buttons: 0, target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        strokeToolTest.mouseDown = true;
        strokeToolTest.onMouseMove(event);

        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('onMouseMove, drawLine and Set Position are called is isOutside is false and mouseDown is true', () => {
        strokeToolTest['mousePosition'] = new Vec2(canvasTestHelper.drawCanvas.width + 1, canvasTestHelper.drawCanvas.height);
        const event = {
            x: 25,
            y: 25,
            buttons: 1,
            button: MouseButton.Left,
            offsetX: 30,
            offsetY: 25,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
        strokeToolTest.isOutsideCanvas = false;
        strokeToolTest.mouseDown = true;

        strokeToolTest.onMouseMove(event);

        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseMove, doesn t do anything if mouseDown is false', () => {
        strokeToolTest.mouseDown = false;
        strokeToolTest.onMouseMove(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseOver, doesn t do anything if mouseDown is false', () => {
        strokeToolTest.mouseDown = false;
        strokeToolTest.onMouseOver(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseOver, lastOutsidePosition is set and drawLine and setPositionFromMouse are called', () => {
        const event = {
            x: 25,
            y: 25,
            buttons: 1,
            offsetX: 30,
            offsetY: 25,
            button: MouseButton.Left,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
        strokeToolTest.mouseDown = true;
        strokeToolTest['mousePosition'] = new Vec2(canvasStub.width + 1, canvasStub.height - 1);
        strokeToolTest.onMouseOver(event);
        expect(strokeToolTest.isOutsideCanvas).toEqual(false);
        expect(strokeToolTest['lastOutsidePosition'].equals(new Vec2(canvasStub.width + 1, canvasStub.height - 1))).toBeTrue();

        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseOver, onMouseUp is called if no button is pressed', () => {
        const event = { x: 25, y: 25, buttons: 0, target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        strokeToolTest.mouseDown = true;
        strokeToolTest.onMouseOver(event);

        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown to false', () => {
        strokeToolTest.onMouseUp(mouseEvent);
        expect(strokeToolTest.mouseDown).toEqual(false);
    });

    it('onMouseUp should call draw if mouseDown is equal to true', () => {
        strokeToolTest.mouseDown = true;

        strokeToolTest.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not go in the if statement branch if mouseDown is equal to false', () => {
        strokeToolTest.mouseDown = false;
        strokeToolTest['mousePosition'] = new Vec2(0,0);

        strokeToolTest.onMouseUp(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should call draw', () => {
        strokeToolTest.mouseDown = true;
        strokeToolTest.isOutsideCanvas = true;
        strokeToolTest['mousePosition'] = new Vec2(0,0);

        strokeToolTest.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalledWith(true, strokeToolTest['toolActionData']);
    });

    it('Should call draw without changing mouseDownCoord', () => {
        strokeToolTest.mouseDown = true;
        strokeToolTest.isOutsideCanvas = true;

        strokeToolTest.onMouseUp(mouseEvent);

        expect(drawSpy).toHaveBeenCalled();
        expect(strokeToolTest['mousePosition']).toBeUndefined();
    });

    it('onMouseDown should set mouseDown to true', () => {
        strokeToolTest['mousePosition'] = new Vec2(25,25);
        const cursorIsOverCanvas = {
            button: MouseButton.Left,
            buttons: 1,
            offsetX: 30,
            offsetY: 25,
            x: 25,
            y: 25,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
        strokeToolTest.onMouseDown(cursorIsOverCanvas);
        expect(strokeToolTest.mouseDown).toEqual(true);
    });

    it('Should return the insidePoint if the outside point is not beyond the canvas', () => {
        const insidePoint = new Vec2(1,1);
        const outsidePoint = new Vec2(
            strokeToolTest['drawingService'].canvas.width - 1,
            strokeToolTest['drawingService'].canvas.height - 1,
        );
        expect(strokeToolTest['calculateIntersectionPoint'](outsidePoint, insidePoint).equals(insidePoint)).toBeTrue();
    });

    it('Should exit onMouseOut if mouseDown is false', () => {
        strokeToolTest.mouseDown = false;
        const mouseEvent2 = { target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        strokeToolTest.onMouseOut(mouseEvent2);
        expect(onMouseUpSpy).not.toHaveBeenCalled();
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('Should exit onMouseOut if buttons is zero', () => {
        strokeToolTest.mouseDown = true;
        const mouseEvent2 = { buttons: 0, target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        strokeToolTest.onMouseOut(mouseEvent2);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('Should call drawLine if mouseDown is true and mouseEvent.buttons is not zero', () => {
        strokeToolTest.mouseDown = true;
        strokeToolTest['mousePosition'] = new Vec2(
            138,
            796,
        );
        strokeToolTest['lastInsidePosition'] = new Vec2(
            403,
            796,
        );
        const mouseEvent2 = { buttons: 1, x: 1080, y: 1080, target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        strokeToolTest.onMouseOut(mouseEvent2);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('should draw line with lineTo when shouldMoveTo is false', () => {
        const point = new Vec2(1,1);
        const shouldMoveTo = false;
        strokeToolTest['pathData'].push({ point, shouldMoveTo });

        const lineToSpy = spyOn<any>(baseCtxStub, 'lineTo').and.callThrough();

        strokeToolTest['draw'](true, strokeToolTest['toolActionData']);

        expect(drawSpy).toHaveBeenCalledWith(true, strokeToolTest['toolActionData']);
        expect(lineToSpy).toHaveBeenCalledWith(point.x, point.y);
    });

    it('should draw line with moveTo when shouldMoveTo is true', () => {
        const point = new Vec2(1,1);
        const shouldMoveTo = true;
        strokeToolTest['pathData'].push({ point, shouldMoveTo });

        const moveToSpy = spyOn<any>(baseCtxStub, 'moveTo').and.callThrough();

        strokeToolTest['draw'](true, strokeToolTest['toolActionData']);

        expect(drawSpy).toHaveBeenCalledWith(true, strokeToolTest['toolActionData']);
        expect(moveToSpy).toHaveBeenCalledWith(point.x, point.y);
    });
});
