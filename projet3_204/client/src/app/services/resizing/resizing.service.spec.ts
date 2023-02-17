import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse.constants';
import { BUTTON_POSITION, DEFAULT_HEIGHT, DEFAULT_WIDTH, MIN_HEIGHT, MIN_WIDTH } from '@app/constants/style.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ResizingService } from './resizing.service';

// tslint:disable
describe('ResizingService', () => {
    let service: ResizingService;
    let canvasTester: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    const target = ({ id: 'Hello' } as HTMLElement) as EventTarget;
    const event = { button: MouseButton.Left as number, x: 500, y: 500, target, buttons: 1 } as MouseEvent;
    let onMouseUpSpy: jasmine.Spy<any>;
    let drawingServiceStub: DrawingService;
    let undoServiceStub: UndoRedoService;

    beforeEach(() => {
        canvasTester = new CanvasTestHelper();
        drawingServiceStub = new DrawingService();
        undoServiceStub = new UndoRedoService(drawingServiceStub)
        service = new ResizingService(undoServiceStub);
        baseCtxStub = canvasTester.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTester.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({});
        service = TestBed.inject(ResizingService);
        service.baseCtx = baseCtxStub;
        service.previewCtx = previewCtxStub;
        service.previewCanvas = canvasTester.canvas;
        service.baseCanvas = canvasTester.drawCanvas;
        service.canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        service.previewCanvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        service['mouseStartCoords'] = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);

        onMouseUpSpy = spyOn<any>(service, 'onMouseUp').and.callThrough();

        service.canvasContainerParent = {clientWidth: 1000, clientHeight: 1000} as HTMLElement;
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('Should exit onMouseDown if event launched with other than leftButton', () => {
        const event2 = { button: MouseButton.Middle } as MouseEvent;
        service.onMouseDown(event2);
        expect(service.isDragging).toEqual(false);
    });

    it('Should go through with onMouseDown if event launched with leftButton', () => {
        service.onMouseDown(event);
        expect(service.isDragging).toEqual(true);
        expect(service['mouseStartCoords']).toBeDefined();
        expect(service.borderStyle).not.toEqual('');
        expect(service['buttonPosition']).not.toEqual('');
    });

    it('Expect onMouseMove to exit if isDragging is false', () => {
        service.isDragging = false;
        service.onMouseMove(event);
        expect(onMouseUpSpy).not.toHaveBeenCalled();
        expect(service.previewCanvasSize).toEqual(new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT));
    });

    it('Expect onMouseMove to exit if buttons are equal to zero', () => {
        service.isDragging = true;
        const event2 = { buttons: 0 } as MouseEvent;
        service.onMouseMove(event2);
        expect(onMouseUpSpy).toHaveBeenCalled();
    });

    it('Expect onMouseMove to only change the y axis when moving with the Bottom Button', () => {
        service.isDragging = true;
        service['buttonPosition'] = BUTTON_POSITION.Bottom;
        service.onMouseMove(event);
        expect(service.previewCanvasSize.y).toEqual(event.y);
        expect(service.previewCanvasSize.x).toEqual(DEFAULT_WIDTH);
    });

    it('Expect onMouseMove to only change the x axis when moving with the Right Button', () => {
        service.isDragging = true;
        service['buttonPosition'] = BUTTON_POSITION.Right;
        service.onMouseMove(event);
        expect(service.previewCanvasSize.y).toEqual(DEFAULT_HEIGHT);
        expect(service.previewCanvasSize.x).toEqual(event.x);
    });

    it('Expect onMouseMove to only change both axis when moving with the Corner Button', () => {
        service.isDragging = true;
        service['buttonPosition'] = BUTTON_POSITION.Corner;
        service.onMouseMove(event);
        expect(service.previewCanvasSize.y).toEqual(event.y);
        expect(service.previewCanvasSize.x).toEqual(event.x);
    });

    it('Should prevent you from settings too low canvas dimensions', () => {
        service.isDragging = true;
        service['buttonPosition'] = BUTTON_POSITION.Corner;
        const event2 = { button: MouseButton.Left as number, x: 2, y: 2, target, buttons: 1 } as MouseEvent;
        service.onMouseMove(event2);
        expect(service.previewCanvasSize.y).toEqual(MIN_HEIGHT);
        expect(service.previewCanvasSize.x).toEqual(MIN_WIDTH);
    });

    it('Should prevent you from settings too high canvas dimensions', () => {
        service.isDragging = true;
        service['buttonPosition'] = BUTTON_POSITION.Corner;
        const event2 = { button: MouseButton.Left as number, x: 1500, y: 1500, target, buttons: 1 } as MouseEvent;

        service.canvasSize = new Vec2(1200, 1200);

        service.onMouseMove(event2);
        expect(service.previewCanvasSize.y).toEqual(1900);
        expect(service.previewCanvasSize.x).toEqual(1700);
    });

    it('Should prevent you from settings too high canvas dimensions', () => {
        service.isDragging = true;
        service['buttonPosition'] = BUTTON_POSITION.Corner;
        const event2 = { button: MouseButton.Left as number, x: 1500, y: 1500, target, buttons: 1 } as MouseEvent;

        service.canvasSize = new Vec2(500, 500);

        service.onMouseMove(event2);
        expect(service.previewCanvasSize.y).toEqual(990);
        expect(service.previewCanvasSize.x).toEqual(990);
    });

    it('resetCanvasDims should call setSize', () => {
        const setSizeSpy = spyOn<any>(service, 'setSize');
        service.initialCanvasDimensions = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        service.resetCanvasDims();
        expect(setSizeSpy).toHaveBeenCalledWith(service.initialCanvasDimensions);
    });

    it('onMouseUp should exit if isDragging is false', () => {
        const setSizeSpy = spyOn<any>(service, 'setSize');
        service.isDragging = false;
        service.onMouseUp(event);
        expect(setSizeSpy).not.toHaveBeenCalled();
    });
});
