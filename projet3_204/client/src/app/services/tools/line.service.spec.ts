import { TestBed } from '@angular/core/testing';
import { LineActionData } from '@app/classes/actions/line-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { BLACK } from '@app/constants/color.constants';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { LineTypeJonctions } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { LineService } from './line.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('LineService', () => {
    let service: LineService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let canvasStub: HTMLCanvasElement;
    let drawLineSpy: jasmine.Spy<any>;
    let getPosFromMouseSpy: jasmine.Spy<any>;
    let updateViewSpy: jasmine.Spy<any>;
    let calculateIntersectionPointSpy: jasmine.Spy<any>;
    let calculatePointWithAngleSpy: jasmine.Spy<any>;
    let undoRedoSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoSpy },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        canvasStub = canvasTestHelper.canvas;

        service = TestBed.inject(LineService);
        drawLineSpy = spyOn<any>(service, 'draw').and.callThrough();
        getPosFromMouseSpy = spyOn<any>(service, 'getPositionFromMouse').and.callThrough();
        updateViewSpy = spyOn<any>(service, 'updateView').and.callThrough();
        calculateIntersectionPointSpy = spyOn<any>(service, 'calculateIntersectionPoint');
        calculatePointWithAngleSpy = spyOn<any>(LineService, 'calculatePointWithAngle').and.callThrough();

        service.isOutsideCanvas = false;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasStub;

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

    it('onClick should set the first point if it is not already set', () => {
        service.onClick(mouseEvent);
        expect(service['mouseDownPosition']).toBeDefined();
    });

    it('onClick should update the view', () => {
        service.onClick(mouseEvent);
        service.onClick(mouseEvent);
        expect(updateViewSpy).toBeDefined();
    });

    it('onDblClick should exit if started is not true', () => {
        service.started = false;
        service.onDblClick(mouseEvent);
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('onDblClick doit rendre le point final le meme que celui initial si ils sont prochent de moins de 20 pixels', () => {
        service.started = true;

        service['mouseDownPosition'] = new Vec2(20, 20);
        service['pathData'] = [
            { point: service['mouseDownPosition'], shouldMoveTo: false },
            { point: new Vec2(1, 1), shouldMoveTo: false },
            { point: new Vec2(2, 3), shouldMoveTo: false },
        ];

        service.onDblClick(mouseEvent);
        expect(service.mousePosition).toEqual(service['mouseDownPosition']);
    });

    it('onDblClick ne doit pas rendre le point final le meme que celui initial si ils sont prochent de plus de 20 pixels', () => {
        service.started = true;

        service['mouseDownPosition'] = new Vec2(500, 50);
        service['pathData'] = [
            { point: service['mouseDownPosition'], shouldMoveTo: false },
            { point: new Vec2(1, 1), shouldMoveTo: false },
            { point: new Vec2(2, 2), shouldMoveTo: false },
        ];
        service.onDblClick(mouseEvent);
        expect(service.mousePosition).not.toEqual(service['mouseDownPosition']);
    });

    it('onMouseMove should exit if started is not true', () => {
        service.started = false;
        service.onMouseMove(mouseEvent);
        expect(getPosFromMouseSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should update the view if started is true', () => {
        service.started = true;
        service.onMouseMove(mouseEvent);
        expect(updateViewSpy).toHaveBeenCalled();
    });

    it('updateView should do nothing if started is false', () => {
        service.started = false;
        service.isOutsideCanvas = true;
        service['updateView']();
        expect(drawLineSpy).not.toHaveBeenCalled();
    });

    it('updateView should calculate the intersection point with the canvas borders if the mouseDownCoord is outside of the canvas', () => {
        service.started = true;
        service.isOutsideCanvas = true;
        service['updateView']();
        expect(calculateIntersectionPointSpy).toHaveBeenCalled();
    });

    it('updateView should calculate the point coords according the angle formed with the x axis if shift is down', () => {
        service.started = true;
        service.shiftDown = true;
        service['lastPoint'] = new Vec2(9, 9);
        service.mousePosition = new Vec2(10, 10);
        service['updateView']();
        expect(calculatePointWithAngleSpy).toHaveBeenCalled();
    });

    it('onKeyDown should exit if started is not true', () => {
        service.started = false;
        service.onKeyDown({ key: KeyboardButton.Shift } as KeyboardEvent);
        expect(updateViewSpy).not.toHaveBeenCalled();
    });

    it('onKeyDown should call updateViewSpy if started is true and if the key pressed is shift', () => {
        service.started = true;
        service['lastPoint'] = new Vec2(9, 9);
        service.mousePosition = new Vec2(10, 10);
        service.onKeyDown({ key: KeyboardButton.Shift } as KeyboardEvent);
        expect(updateViewSpy).toHaveBeenCalled();
    });

    it('onKeyUp should call updateViewSpy if started is true and if the key pressed is shift', () => {
        service.started = true;
        service.onKeyUp({ key: KeyboardButton.Shift } as KeyboardEvent);
        expect(updateViewSpy).toHaveBeenCalled();
    });

    it('onKeyUp should call updateViewSpy if started is true and if the key pressed is backspace', () => {
        service.started = true;
        service.onKeyUp({ key: KeyboardButton.Backspace } as KeyboardEvent);
        expect(updateViewSpy).toHaveBeenCalled();
    });

    it('onKeyUp should pop pathData if its length is higher than 1 if started is true and if the key pressed is backspace', () => {
        service.started = true;
        service['pathData'] = [
            { point: new Vec2(20, 20), shouldMoveTo: false },
            { point: new Vec2(1, 1), shouldMoveTo: false },
            { point: new Vec2(2, 3), shouldMoveTo: false },
        ];

        const initialLengthOfPathData = service['pathData'].length;
        service.onKeyUp({ key: KeyboardButton.Backspace } as KeyboardEvent);
        const finalLengthOfPathData = service['pathData'].length;

        expect(initialLengthOfPathData).toEqual(finalLengthOfPathData + 1);
    });

    it('onKeyUp should call clearCanvas if started is true and if the key pressed is escape', () => {
        service.started = true;
        service.onKeyUp({ key: KeyboardButton.Escape } as KeyboardEvent);
        expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
    });

    it('drawLine should clear pathData if the ctx is the baseCtx', () => {
        service['pathData'] = [
            { point: new Vec2(20, 20), shouldMoveTo: false },
            { point: new Vec2(1, 1), shouldMoveTo: false },
            { point: new Vec2(2, 3), shouldMoveTo: false },
        ];
        service.draw(true, new LineActionData(BLACK));
        expect(service['pathData'].length).toEqual(0);
    });

    it('drawLine should drawThickPoints if LineTypeJonctions in set', () => {
        service.toolActionData = new LineActionData(BLACK);
        service['pathData'] = [
            { point: new Vec2(20, 20), shouldMoveTo: false },
            { point: new Vec2(1, 1), shouldMoveTo: false },
            { point: new Vec2(2, 3), shouldMoveTo: false },
        ];
        service.typeJonction = LineTypeJonctions.AvecPoints;
        service.pointDiameter = 50;
        service.draw(false, service.toolActionData);

        expect(previewCtxStub.lineWidth).toEqual(50);
    });

    it('calculatePointWithAngle should set y of the calculated point to y of the center point if it is near the x axis', () => {
        service['lastPoint'] = new Vec2(10, 10);
        const secondPoint = new Vec2(5, 11);
        const resultPoint = LineService['calculatePointWithAngle'](secondPoint, service['lastPoint']);
        expect(resultPoint.equals(new Vec2(secondPoint.x, service['lastPoint'].y))).toBeTrue();
    });

    it('calculatePointWithAngle should set x of the calculated point to x of the center point if it is perpendiculat to the x axis', () => {
        service['lastPoint'] = new Vec2(6, 10);
        const secondPoint = new Vec2(5, 1);
        const resultPoint = LineService['calculatePointWithAngle'](secondPoint, service['lastPoint']);
        expect(resultPoint.equals(new Vec2(service['lastPoint'].x, secondPoint.y))).toBeTrue();
    });

    it('the getter for typeJonction should work', () => {
        expect(service.typeJonction).toEqual(service['toolActionData'].typeJonctions);
    });

    it('the getter for pointDiameter should work', () => {
        expect(service.pointDiameter).toEqual(service['toolActionData'].pointDiameter);
    });
});
