import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EraserService } from './eraser.service';

// tslint:disable
describe('EraserService', () => {
    let service: EraserService;
    let mouseEvent: MouseEvent;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;

    let drawLineSpy: jasmine.Spy<any>;
    let fillRectSpy: jasmine.Spy<any>;
    let drawCursorSpy: jasmine.Spy<any>;
    let moveToSpy: jasmine.Spy<any>;

    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
        });

        service = TestBed.inject(EraserService);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;

        drawLineSpy = spyOn<any>(service, 'draw').and.callThrough();
        drawCursorSpy = spyOn<any>(service, 'drawCursor').and.callThrough();
        fillRectSpy = spyOn<any>(baseCtxStub, 'fillRect').and.callThrough();
        moveToSpy = spyOn<any>(previewCtxStub, 'moveTo').and.callThrough();

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
        expect(service).toBeTruthy();
    });

    it('calls draw', () => {
        const shouldMoveTo = false as boolean;
        const point = new Vec2(1, 1);
        service['pathData'].push({ point, shouldMoveTo });
        service['pathData'].push({ point, shouldMoveTo });

        const lineToSpy = spyOn<any>(baseCtxStub, 'lineTo').and.callThrough();
        service['draw'](true, service['toolActionData']);

        expect(drawLineSpy).toHaveBeenCalledWith(true, service['toolActionData']);
        expect(fillRectSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
    });

    it('onMouseMove, doesn t do anything if mouseDown is false', () => {
        service.mouseDown = false;
        service.onMouseMove(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove, draw and Set Position are called is isOutside is false and mouseDown is true', () => {
        service['mousePosition'] = new Vec2(canvasTestHelper.drawCanvas.width + 1, canvasTestHelper.drawCanvas.height - 1);
        const event = {
            x: 25,
            y: 25,
            buttons: 0,
            button: MouseButton.Left,
            offsetX: 30,
            offsetY: 25,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
        service.mouseDown = true;
        const onMouseUpSpy = spyOn<any>(service, 'onMouseUp');
        service.onMouseMove(event);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('onMouseMove, draw and Set Position are called is isOutside is false and mouseDown is true', () => {
        service['mousePosition'] = new Vec2(canvasTestHelper.drawCanvas.width + 1, canvasTestHelper.drawCanvas.height - 1);
        const event = {
            x: 25,
            y: 25,
            buttons: 1,
            button: MouseButton.Left,
            offsetX: 30,
            offsetY: 25,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
        service.isOutsideCanvas = false;
        service.mouseDown = true;
        service.onMouseMove(event);

        expect(drawLineSpy).toHaveBeenCalled();
    });

    it('onMouseMove, sets lastInsidePosition if mouseDown is true and isOutside is false', () => {
        const event = { x: 25, y: 25, buttons: 1, target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        service.mouseDown = true;
        service.isOutsideCanvas = false;

        service['mousePosition'] = new Vec2(-1, -1);
        const value = new Vec2(2, 2);
        service['lastInsidePosition'] = value;
        service.onMouseMove(event);

        expect(service['lastInsidePosition']).toEqual(service['mousePosition']);
        expect(service['lastInsidePosition']).not.toEqual(value);
    });

    it('onMouseMove, sets lastOusidePosition to mouseDownCoord if mouseDown and isOutsideCanvas are true', () => {
        const event = { x: 25, y: 25, offsetX: 25, offsetY: 25, buttons: 1, target: previewCtxStub.canvas as EventTarget } as MouseEvent;
        service.mouseDown = true;
        service.isOutsideCanvas = true;

        const value = new Vec2(2, 2);
        service['lastOutsidePosition'] = value;
        service.onMouseMove(event);

        expect(service['lastOutsidePosition']).toEqual(service['mousePosition']);
    });

    it('onMouseUp should call drawCursor', () => {
        service.mouseDown = true;
        service.isOutsideCanvas = true;
        service['mousePosition'] = new Vec2(0, 0);

        service.onMouseUp(mouseEvent);
        expect(drawCursorSpy).toHaveBeenCalled();
    });

    it('drawLine should call moveTo when a point is outside the canvas', () => {
        service['pathData'] = [
            { point: new Vec2(0, 0), shouldMoveTo: false },
            { point: new Vec2(-1, -1), shouldMoveTo: true },
            { point: new Vec2(100, 100), shouldMoveTo: false },
        ];
        service.draw(false, service['toolActionData']);

        expect(moveToSpy).toHaveBeenCalled();
    });
});
