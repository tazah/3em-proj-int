import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/style.constants';
import { NewDrawingService } from '@app/services/file-options/new-drawing.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { NewDrawingComponent } from './new-drawing.component';

/* tslint:disable */

describe('NewDrawingComponent', () => {
    let component: NewDrawingComponent;
    let fixture: ComponentFixture<NewDrawingComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<NewDrawingComponent>>;
    let resizeServiceStub: jasmine.SpyObj<ResizingService>;
    let toolSwitcherServiceSpy: jasmine.SpyObj<ToolSwitcherService>;
    let toolServiceStub: jasmine.SpyObj<PencilService>;
    let canvasTestHelper: CanvasTestHelper;
    let newDrawingServiceSpy: jasmine.SpyObj<NewDrawingService>;
    let undoRedoSpy: jasmine.SpyObj<UndoRedoService>;
    beforeEach(() => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef<NewDrawingComponent>', ['close']);
        newDrawingServiceSpy = jasmine.createSpyObj('NewDrawingService', ['onCancel', 'initialSize']);
        resizeServiceStub = jasmine.createSpyObj('ResizeService', ['onMouseDown', 'onMouseMove', 'onMouseUp']);
        toolSwitcherServiceSpy = jasmine.createSpyObj('ToolSwitcherService', ['switchTool', 'currentService']);
        toolServiceStub = jasmine.createSpyObj('PencilService', [
            'onMouseMove',
            'onMouseUp',
            'onMouseDown',
            'onMouseOut',
            'onMouseOver',
            'onSwitch',
            'onClick',
            'onDblClick',
        ]);

        undoRedoSpy = jasmine.createSpyObj('UndoRedoService', ['reset', 'newDrawing', 'saveDrawing']);

        toolSwitcherServiceSpy.currentService = toolServiceStub;
        resizeServiceStub.previewCanvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        resizeServiceStub.canvasSize = new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        TestBed.configureTestingModule({
            declarations: [NewDrawingComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: ToolSwitcherService, useValue: toolSwitcherServiceSpy },
                { provide: ResizingService, useValue: resizeServiceStub },
                { provide: NewDrawingService, useValue: newDrawingServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoSpy },
            ],
        }).compileComponents();
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        resizeServiceStub.baseCanvas = canvasTestHelper.canvas;
        resizeServiceStub.previewCanvas = canvasTestHelper.drawCanvas;
        resizeServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        resizeServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        fixture = TestBed.createComponent(NewDrawingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('newDrawing() should close the dialogRef', () => {
        component.newDrawing();
        expect(undoRedoSpy.reset).toHaveBeenCalled();
        expect(newDrawingServiceSpy.onCancel).toHaveBeenCalled();
    });

    it('onCancel() should close the dialogRef', () => {
        component.onCancel();
        expect(newDrawingServiceSpy.onCancel).toHaveBeenCalled();
    });
});
