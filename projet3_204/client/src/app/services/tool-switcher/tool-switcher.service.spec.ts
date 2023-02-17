import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color';
import { BLACK, WHITE } from '@app/constants/color.constants';
import { ToolKey } from '@app/constants/tool.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { MouseService } from '@app/services/tools/mouse.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ToolSwitcherService } from './tool-switcher.service';

describe('ToolSwitcherService', () => {
    let service: ToolSwitcherService;
    let ellipseServiceStub: EllipseService;
    let rectangleServiceStub: RectangleService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let undoServiceStub: UndoRedoService;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['update']);
        colorServiceSpy.primaryColor = new Color(BLACK);
        colorServiceSpy.secondaryColor = new Color(WHITE);
        undoServiceStub = new UndoRedoService(drawServiceSpy);

        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(ToolSwitcherService);
        service.attributeBar = jasmine.createSpyObj('attributeBar', ['open', 'close']);
        spyOn(service.services, 'get');
        rectangleServiceStub = new RectangleService(drawServiceSpy, colorServiceSpy, undoServiceStub);
        ellipseServiceStub = new EllipseService(drawServiceSpy, rectangleServiceStub, colorServiceSpy, undoServiceStub);

        // tslint:disable:no-string-literal
        ellipseServiceStub['drawingService'].baseCtx = baseCtxStub;
        ellipseServiceStub['drawingService'].previewCtx = previewCtxStub;

        rectangleServiceStub['drawingService'].baseCtx = baseCtxStub;
        rectangleServiceStub['drawingService'].previewCtx = previewCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not enter the if statement if it is an old tool', () => {
        service.switchTool(ToolKey.Mouse);
        expect(service.services.get).not.toHaveBeenCalled();
    });

    it('should enter the if statement if it is an new tool, should change the service', () => {
        service.services = new Map([
            [ToolKey.Mouse, new MouseService(new DrawingService(), new ColorService(), new UndoRedoService(drawServiceSpy))],
            [ToolKey.Ellipse, ellipseServiceStub],
            [ToolKey.Rectangle, rectangleServiceStub],
        ]);

        service.switchTool(ToolKey.Ellipse);
        let tempService = service.services.get(ToolKey.Ellipse);
        expect(tempService).toBeDefined();
        if (tempService) {
            expect(service.currentService).toEqual(tempService);
        }

        service.switchTool(ToolKey.Rectangle);
        tempService = service.services.get(ToolKey.Rectangle);
        expect(tempService).toBeDefined();
        if (tempService) {
            expect(service.currentService).toEqual(tempService);
        }
    });

    it('should switch the tool', () => {
        service.switchTool(ToolKey.Ellipse);
        expect(service.currentTool).toEqual(ToolKey.Ellipse);
        service.switchTool(ToolKey.Rectangle);
        expect(service.currentTool).toEqual(ToolKey.Rectangle);
    });

    it('should open or close the navigation bar depending on the currentTool', () => {
        service.switchTool(ToolKey.Mouse);

        service.switchTool(ToolKey.Ellipse);
        expect(service.attributeBar.open).toHaveBeenCalled();

        service.switchTool(ToolKey.Mouse);
        expect(service.attributeBar.close).toHaveBeenCalled();
    });
});
