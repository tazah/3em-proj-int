import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/style.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { DrawingComponent } from './drawing.component';

describe('DrawingComponent', () => {
    let component: DrawingComponent;
    let fixture: ComponentFixture<DrawingComponent>;
    let drawingStub: DrawingService;
    let toolSwitcherServiceSpy: jasmine.SpyObj<ToolSwitcherService>;
    let toolServiceStub: jasmine.SpyObj<PencilService>;
    let resizeServiceStub: jasmine.SpyObj<ResizingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        drawingStub = new DrawingService();
        toolSwitcherServiceSpy = jasmine.createSpyObj('ToolSwitcherService', ['switchTool', 'currentService']);
        toolServiceStub = jasmine.createSpyObj('PencilService', [
            'onMouseMove',
            'onMouseUp',
            'onMouseDown',
            'onMouseOut',
            'onMouseOver',
            'onMouseWheel',
            'onSwitch',
            'onClick',
            'onDblClick',
        ]);
        resizeServiceStub = jasmine.createSpyObj('ResizeService', ['onMouseDown', 'onMouseMove', 'onMouseUp', 'onMouseWheel']);
        toolSwitcherServiceSpy.currentService = toolServiceStub;
        resizeServiceStub.previewCanvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        resizeServiceStub.canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['reset', 'loadDrawing', 'setInitialDimensions', 'refreshView']);

        TestBed.configureTestingModule({
            declarations: [DrawingComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: ToolSwitcherService, useValue: toolSwitcherServiceSpy },
                { provide: ResizingService, useValue: resizeServiceStub },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
            imports: [MatDialogModule],
        }).compileComponents();

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        resizeServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        resizeServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        fixture = TestBed.createComponent(DrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('constuctor()', () => {
        it('should call setInitialDimensions if savedDrawingLoaded is true', () => {
            undoRedoServiceSpy.savedDrawingLoaded = true;
            fixture = TestBed.createComponent(DrawingComponent);
            expect(undoRedoServiceSpy.setInitialDimensions).toHaveBeenCalled();
        });
    });

    it(" should call the tool's mouse move when receiving a mouse move event", () => {
        const event = {} as MouseEvent;
        component.onMouseMove(event);
        expect(toolServiceStub.onMouseMove).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse wheel when receiving a wheel event", () => {
        const event = {} as WheelEvent;
        component.onMouseWheel(event);
        expect(toolServiceStub.onMouseWheel).toHaveBeenCalledWith(event);
    });

    it(" should call the tool's mouse down when receiving a mouse down event", () => {
        component.onCanvasMouseDown({} as MouseEvent);
        expect(toolServiceStub.onMouseDown).toHaveBeenCalledWith({} as MouseEvent);
    });

    it(" should call the resize service's mouse down when receiving a mouse down event from the resizeButton", () => {
        component.onResizeMouseDown({} as MouseEvent);
        expect(resizeServiceStub.onMouseDown).toHaveBeenCalledWith({} as MouseEvent);
    });

    it(" should call the tool's mouse up when receiving a mouse up event", () => {
        const event = {} as MouseEvent;
        component.onMouseUp(event);
        expect(toolServiceStub.onMouseUp).toHaveBeenCalledWith(event);
    });

    it('Should cancel all drag events', () => {
        const event = jasmine.createSpyObj('DragEvent', ['preventDefault']);
        component.onDragStart(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('Should call the currentService onMouseOut method if the cursor exists the canvas', () => {
        component.onCanvasMouseOut({} as MouseEvent);
        expect(toolServiceStub.onMouseOut).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('Should call the currentService onMouseOver method if the cursor exists the canvas', () => {
        component.onCanvasMouseOver({} as MouseEvent);
        expect(toolServiceStub.onMouseOver).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('Should not reinitialize the canvas if it has not resized', () => {
        resizeServiceStub.hasResized = false;
        resizeServiceStub.baseCtx = jasmine.createSpyObj('CanvasRenderingContext2D', ['putImageData']);
        component.ngAfterViewChecked();
        expect(resizeServiceStub.baseCtx.putImageData).not.toHaveBeenCalled();
    });
    it('Should not reinitialize the canvas if it has not resized', () => {
        resizeServiceStub.hasResized = false;
        resizeServiceStub.baseCtx = jasmine.createSpyObj('CanvasRenderingContext2D', ['putImageData']);
        component.ngAfterViewChecked();
        expect(resizeServiceStub.baseCtx.putImageData).not.toHaveBeenCalled();
    });

    // tslint:disable: no-magic-numbers
    it('Should reinitialize the canvas if it has been resized', () => {
        resizeServiceStub.hasResized = true;
        component.ngAfterViewChecked();
        expect(resizeServiceStub.hasResized).toEqual(false);
    });

    it('Should return resizeService viewResized', () => {
        expect(component.viewResized).toEqual(resizeServiceStub.hasResized);
        resizeServiceStub.hasResized = true;
        expect(component.viewResized).toEqual(resizeServiceStub.hasResized);
    });

    it('onCanvasClick should call the currentService onCLick', () => {
        component.onCanvasClick({} as MouseEvent);
        expect(toolServiceStub.onClick).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('onCanvasDblClick should call the currentService onCLick', () => {
        component.onCanvasDblClick({} as MouseEvent);
        expect(toolServiceStub.onDblClick).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('should call preventDefault onRightClick', () => {
        const event = jasmine.createSpyObj('MouseEvent', ['preventDefault']);
        component.onRightClick(event);
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
