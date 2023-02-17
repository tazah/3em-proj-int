import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse.constants';
import { Style } from '@app/constants/style.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RectangleService } from './rectangle.service';

// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-magic-numbers
describe('RectangleService', () => {
    let service: RectangleService;
    let mouseEvent: MouseEvent;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSpy: jasmine.Spy<any>;

    let fillRectSpy: jasmine.Spy<any>;
    let strokeRectSpy: jasmine.Spy<any>;
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

        service = TestBed.inject(RectangleService);
        drawSpy = spyOn<any>(service, 'draw').and.callThrough();

        fillRectSpy = spyOn<any>(baseCtxStub, 'fillRect').and.callThrough();
        strokeRectSpy = spyOn<any>(baseCtxStub, 'strokeRect').and.callThrough();

        service.isOutsideCanvas = false;
        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].selectionBoxCtx = baseCtxStub;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            button: 0,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('onMouseDown should set mouseDownCoord to correct position', () => {
        const expectedResult = new Vec2(25, 25);
        service.onMouseDown(mouseEvent);
        expect(service.mouseDownPosition.equals(expectedResult)).toBeTrue();
    });

    it('onMouseDown should set mouseDown to true', () => {
        service.mouseDown = true;
        service.onMouseDown(mouseEvent);
        expect(service.mouseDown).toEqual(true);
    });

    it('onMouseDown should set mouseDown property to false on right click', () => {
        const mouseEventRClick = {
            offsetX: 25,
            offsetY: 25,
            button: MouseButton.Right,
            target: previewCtxStub.canvas as EventTarget,
        } as MouseEvent;
        service.onMouseDown(mouseEventRClick);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseUp should set mouseDown to false', () => {
        service.mouseDown = true;
        service.mouseDownPosition = new Vec2(0, 0);

        service.onMouseUp(mouseEvent);
        expect(service.mouseDown).toEqual(false);
    });

    it('onMouseUp should call drawRectangle if mouseDown is equal to true', () => {
        service.mouseDown = true;
        service.mouseDownPosition = new Vec2(0, 0);

        service.onMouseUp(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it('onMouseUp should not go in the if statement branch if drawing is equal to false', () => {
        service.mouseDown = false;
        service.mouseDownPosition = new Vec2(0, 0);

        service.onMouseUp(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should not call drawRectangle if mouseDown is equal to false', () => {
        service.mouseDown = false;
        service.mouseDownPosition = new Vec2(0, 0);

        service.onMouseMove(mouseEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should call drawRectangle if mouseDown equal to true', () => {
        service.mouseDown = true;
        service.mouseDownPosition = new Vec2(0, 0);

        service.onMouseMove(mouseEvent);
        expect(drawSpy).toHaveBeenCalled();
    });

    it(' onKeyDown should verify if shift key is pressed', () => {
        service.mouseDown = true;
        service.mouseDownPosition = new Vec2(0, 0);
        service.mousePosition = new Vec2(0, 0);

        service.onKeyDown({ key: 'Enter' as string } as KeyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();

        service.onKeyDown({ key: 'Shift' as string } as KeyboardEvent);
        expect(drawSpy).toHaveBeenCalled();

        expect(service['shiftDown']).toEqual(true);
    });

    it(' onKeyUp should verify if shift key is pressed', () => {
        service.mouseDown = true;
        service.mouseDownPosition = new Vec2(0, 0);
        service.mousePosition = new Vec2(0, 0);

        service.onKeyUp({ key: 'Enter' as string } as KeyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();

        service.onKeyUp({ key: 'Shift' as string } as KeyboardEvent);
        expect(drawSpy).toHaveBeenCalled();

        expect(service['shiftDown']).toEqual(false);
    });

    it(' onKeyDown should not call drawRectangle if mouseDown is false', () => {
        service.mouseDown = false;
        service.onKeyDown({ key: 'Shift' as string } as KeyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' onKeyUp should not call drawRectangle if mouseDown is false', () => {
        service.mouseDown = false;
        service.onKeyUp({ key: 'Shift' as string } as KeyboardEvent);
        expect(drawSpy).not.toHaveBeenCalled();
    });

    it(' drawRectangle should go in the all the if related to drawing a square backwards', () => {
        service.shiftDown = true;
        service.mouseDownPosition = new Vec2(100, 100);
        service.mousePosition = new Vec2(90, 25);
        service['draw'](true, service['toolActionData']);
        expect(drawSpy).toHaveBeenCalledWith(true, service['toolActionData']);
    });

    it('drawRectangle should call stroke only', () => {
        service.mouseDownPosition = new Vec2(100, 100);
        service.mousePosition = new Vec2(90, 25);
        service['shapeStyle'] = Style.Stroke;
        service['draw'](true, service['toolActionData']);
        expect(strokeRectSpy).toHaveBeenCalled();
        expect(fillRectSpy).not.toHaveBeenCalled();
    });

    it('drawRectangle should call fill only', () => {
        service.mouseDownPosition = new Vec2(100, 100);
        service.mousePosition = new Vec2(90, 25);
        service['shapeStyle'] = Style.Fill;
        service['draw'](true, service['toolActionData']);
        expect(strokeRectSpy).not.toHaveBeenCalled();
        expect(fillRectSpy).toHaveBeenCalled();
    });
});
