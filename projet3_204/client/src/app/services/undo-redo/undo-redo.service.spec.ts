import { TestBed } from '@angular/core/testing';
import { Action } from '@app/classes/actions/action';
import { ResizeAction } from '@app/classes/actions/resize-action';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { LOCAL_STORAGE_DRAWING_KEY, LOCAL_STORAGE_INITIAL_DIMENSIONS } from '@app/constants/file-options.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { UndoRedoService } from './undo-redo.service';

class ActionTest extends Action {}

// tslint:disable no-any
// tslint:disable: no-string-literal
describe('UndoRedoService', () => {
    let service: UndoRedoService;
    let drawingServiceSpy: jasmine.SpyObj<DrawingService>;
    let actionTest: jasmine.SpyObj<ActionTest>;
    let resizingServiceSpy: jasmine.SpyObj<ResizingService>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawingServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas', 'setCanvasBackgroundToWhite']);
        resizingServiceSpy = jasmine.createSpyObj('ResizingService', ['resetCanvasDims']);
        TestBed.configureTestingModule({
            providers: [{ provide: DrawingService, useValue: drawingServiceSpy }],
        });
        service = TestBed.inject(UndoRedoService);
        service.resizingService = resizingServiceSpy;

        actionTest = jasmine.createSpyObj('ActionTest', ['execute', 'executeAll', 'executeResizeAction', 'pushLinkedAction']);

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceSpy.baseCtx = baseCtxStub;
        drawingServiceSpy.canvas = canvasTestHelper.canvas;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('refreshView should execute all elements in actionsDone', () => {
        service.actionsDone.push(actionTest);
        service.refreshView();
        expect(actionTest.execute).toHaveBeenCalled();
    });

    it('refreshView draw image onto baseCtx if canvasImg is defined', () => {
        const value = new Image();
        // tslint:disable-next-line: no-magic-numbers
        value.width = value.height = 100;
        service.image = value;
        expect(service.canvasImg).toBeDefined();
        // tslint:disable-next-line: no-any
        const drawImgSpy = spyOn<any>(baseCtxStub, 'drawImage').and.callThrough();
        service.refreshView();
        expect(drawImgSpy).toHaveBeenCalled();
    });

    it('undo should exit if actionsDone is empty', () => {
        service.undo();
        expect(drawingServiceSpy.clearCanvas).not.toHaveBeenCalled();
    });

    it('redo should exit if actionsDone is empty', () => {
        service.redo();
        expect(service.actionsDone.length).toEqual(0);
    });

    it('redo should remove action from actionsUndone, execute it and put it in actionsDone', () => {
        service.actionsUndone.push(actionTest);
        service.redo();
        expect(actionTest.executeAll).toHaveBeenCalled();
        expect(service.actionsDone.length).toEqual(1);
    });

    it('undo should remove an action from actionsDone, clear the canvas, reset its dimensions and execute all elements executeResizeAction', () => {
        service.actionsDone.push(actionTest);
        service.actionsDone.push(actionTest);
        service.undo();
        expect(service.actionsUndone.length).toEqual(1);
        expect(drawingServiceSpy.clearCanvas).toHaveBeenCalled();
        expect(resizingServiceSpy.resetCanvasDims).toHaveBeenCalled();
        expect(actionTest.executeResizeAction).toHaveBeenCalled();
    });

    describe('addAction()', () => {
        it('should addAction', () => {
            const saveDrawingSpy = spyOn(service, 'saveDrawing');
            service.actionsDone = [];
            service.addAction(actionTest);
            expect(service.actionsDone.length).toEqual(1);
            expect(saveDrawingSpy).toHaveBeenCalled();
        });

        it('should call pushLinkedAction if an actionToBeLinked is available', () => {
            service.addActionToBeLinked(actionTest);
            service.actionsDone = [];
            service.addAction(actionTest);
            expect(service.actionsDone.length).toEqual(1);
            expect(actionTest.pushLinkedAction).toHaveBeenCalled();
        });

        it('should call saveDrawing the the action is an instance of ResizeAction', () => {
            const saveDrawingSpy = spyOn(service, 'saveDrawing');
            service.actionsDone = [];
            service.addAction(new ResizeAction(new Vec2(1, 1), new Vec2(1, 1), resizingServiceSpy, baseCtxStub));
            expect(saveDrawingSpy).not.toHaveBeenCalled();
        });
    });

    it('reset should set canvas Back ground to white', () => {
        service.reset();
        service.actionsDone.push(actionTest);
        service.actionsUndone.push(actionTest);
        expect(drawingServiceSpy.setCanvasBackgroundToWhite).toHaveBeenCalled();
    });

    it('should set canvasImg to img src passed in parameter', () => {
        const value = new Image();
        // tslint:disable-next-line: no-magic-numbers
        value.width = value.height = 100;
        service.image = value;
        expect(service.canvasImg).toEqual(value);
    });

    describe('loadDrawing()', () => {
        it('should do nothing if there is no old drawing', () => {
            localStorage.removeItem(LOCAL_STORAGE_DRAWING_KEY);
            localStorage.removeItem(LOCAL_STORAGE_INITIAL_DIMENSIONS);
            service.loadDrawing();
            expect(service.canvasImg).toBeUndefined();
            expect(service.savedDrawingLoaded).toEqual(false);
        });

        it('should do assign the stored canvasDimensions and image to the local variables', () => {
            localStorage.setItem(LOCAL_STORAGE_DRAWING_KEY, JSON.stringify('lol'));
            localStorage.setItem(LOCAL_STORAGE_INITIAL_DIMENSIONS, JSON.stringify(new Vec2(1, 1)));
            service.loadDrawing();
            expect(service.canvasImg).toBeDefined();
            expect(service['canvasImgDims'].equals(new Vec2(1, 1))).toBeTrue();
            expect(service.savedDrawingLoaded).toEqual(true);
        });
    });

    describe('newDrawing()', () => {
        it('should set the canvasImg to nothing, set isNewDrawing to true and saveDrawingLoaded to false', () => {
            service.newDrawing();
            expect(service.canvasImg).toEqual({} as CanvasImageSource);
            expect(service.savedDrawingLoaded).toBeFalse();
        });
    });

    describe('setInitialDimensions()', () => {
        it('should set the initial canvasDimensions to the localVariable, and call resetCanvasDims', () => {
            service['canvasImgDims'] = new Vec2(1, 1);
            service.setInitialDimensions();
            expect(resizingServiceSpy.initialCanvasDimensions.equals(new Vec2(1, 1))).toBeTrue();
            expect(resizingServiceSpy.resetCanvasDims).toHaveBeenCalled();
        });
    });
});
