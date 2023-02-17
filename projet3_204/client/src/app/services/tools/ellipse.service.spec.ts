import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { Style } from '@app/constants/style.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EllipseService } from './ellipse.service';
import { RectangleService } from './rectangle.service';

// tslint:disable
describe('EllipseService', () => {
    let service: EllipseService;
    let serviceRectangle: RectangleService;
    let canvasTestHelper: CanvasTestHelper;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;

    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let drawSpy: jasmine.Spy<any>;
    let drawPerimeterSpy: jasmine.Spy<any>;
    let drawRectangleSpy: jasmine.Spy<any>;
    let ellipseSpy: jasmine.Spy<any>;
    let strokeSpy: jasmine.Spy<any>;
    let fillSpy: jasmine.Spy<any>;

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

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(EllipseService);
        serviceRectangle = TestBed.inject(RectangleService);
        drawSpy = spyOn<any>(service, 'draw').and.callThrough();
        drawPerimeterSpy = spyOn<any>(service, 'drawPerimeter').and.callThrough();

        drawRectangleSpy = spyOn<any>(serviceRectangle, 'draw').and.callThrough();

        ellipseSpy = spyOn<any>(previewCtxStub, 'ellipse').and.callThrough();
        strokeSpy = spyOn<any>(baseCtxStub, 'stroke').and.callThrough();
        fillSpy = spyOn<any>(baseCtxStub, 'fill').and.callThrough();

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' draw should go in the all the if related to drawing a cercle backwards', () => {
        service.shiftDown = true;
        service.mouseDownPosition = new Vec2(100, 100);
        service.mousePosition = new Vec2(90, 25);
        service.draw(true, service['toolActionData']);
        expect(drawSpy).toHaveBeenCalledWith(true, service['toolActionData']);
    });

    it('draw should draw an ellipse', () => {
        service.shiftDown = true;
        service.mousePosition = new Vec2(100, 100);
        service.mouseDownPosition = new Vec2(90, 25);

        service.draw(false, service['toolActionData']);

        expect(drawPerimeterSpy).toHaveBeenCalled();
        expect(ellipseSpy).toHaveBeenCalled();
    });

    it('draw should call stroke only', () => {
        service.mouseDownPosition = new Vec2(100, 100);
        service.mousePosition = new Vec2(90, 25);
        service.shapeStyle = Style.Stroke;
        service.draw(true, service['toolActionData']);
        expect(strokeSpy).toHaveBeenCalled();
        expect(fillSpy).not.toHaveBeenCalled();
    });

    it('draw should call fill only', () => {
        service.mouseDownPosition = new Vec2(100, 100);
        service.mousePosition = new Vec2(90, 25);
        service.shapeStyle = Style.Fill;
        service.draw(true, service['toolActionData']);
        expect(strokeSpy).not.toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it(' draw should call stroke and fill', () => {
        service.mouseDownPosition = new Vec2(100, 100);
        service.mousePosition = new Vec2(90, 25);
        service.shapeStyle = Style.All;
        service.draw(true, service['toolActionData']);
        expect(strokeSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
    });

    it('drawPerimeter should draw drawRectangle', () => {
        service.mouseDownPosition = new Vec2(5, 10);
        service.mousePosition = new Vec2(5, 10);

        service['drawPerimeter'](10, 10);
        expect(drawRectangleSpy).toHaveBeenCalled();
    });
});
