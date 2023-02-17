import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { BLACK, WHITE } from '@app/constants/color.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { ShapeActionData } from './actions/shape-action-data';
import { CanvasTestHelper } from './canvas-test-helper';
import { ShapeTool } from './shape-tool';

class ShapeToolTest extends ShapeTool {
    constructor(drawingService: DrawingService, colorService: ColorService, undoRedoService: UndoRedoService) {
        super(drawingService, colorService, undoRedoService);
    }
}
// tslint:disable
describe('ShapeToolTest', () => {
    let shapeToolTest: ShapeToolTest;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['update']);
        colorServiceSpy.primaryColor = new Color(BLACK);
        colorServiceSpy.secondaryColor = new Color(WHITE);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);

        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        shapeToolTest = new ShapeToolTest(drawServiceSpy, colorServiceSpy, undoRedoServiceSpy);

        shapeToolTest['drawingService'].baseCtx = baseCtxStub;
        shapeToolTest['drawingService'].previewCtx = previewCtxStub;
        shapeToolTest['drawingService'].canvas = previewCtxStub.canvas;
    });

    it('draw should change the base ctx color', () => {

        shapeToolTest['draw'](false, new  ShapeActionData(colorServiceSpy.secondaryColor.rgbaString, colorServiceSpy.primaryColor.rgbaString));

        expect(previewCtxStub.strokeStyle).toBe(BLACK);
    });

    it('The getter for mousePosition should work', () => {
        expect(shapeToolTest.mousePosition).toEqual(shapeToolTest['toolActionData'].mousePosition);
    });

    it('The getter for shapeStyle should work', () => {
        expect(shapeToolTest.shapeStyle).toEqual(shapeToolTest['toolActionData'].shapeStyle);
    });
});
