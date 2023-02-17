import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { LassoSelectionManager } from './lasso-selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty
describe('LassoSelectionManager', () => {
    let lassoSelectionManager: LassoSelectionManager;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoSpy: jasmine.SpyObj<UndoRedoService>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    const firstPoint = new Vec2(2, 2);
    const secondPoint = new Vec2(10, 100);
    const thirdPoint = new Vec2(5, 25);

    beforeEach(() => {
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectAllCanvas']);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);

        TestBed.configureTestingModule({});
        lassoSelectionManager = new LassoSelectionManager(selectionServiceSpy, drawServiceSpy, undoRedoSpy);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        lassoSelectionManager['drawingService'].baseCtx = baseCtxStub;
        lassoSelectionManager['drawingService'].previewCtx = previewCtxStub;
        lassoSelectionManager['drawingService'].canvas = canvasTestHelper.canvas;
        lassoSelectionManager['drawingService'].selectionBoxCtx = baseCtxStub;

        selectionServiceSpy.selectionState = SelectionState.Nothing;
        selectionServiceSpy.arrowsPressed = new Map([
            [KeyboardButton.ArrowLeft, false],
            [KeyboardButton.ArrowRight, false],
            [KeyboardButton.ArrowUp, false],
            [KeyboardButton.ArrowDown, false],
        ]);

        selectionServiceSpy.topLeftCorner = new Vec2(1, 1);
        selectionServiceSpy.toolActionData = new SelectionActionData();
        selectionServiceSpy.toolActionData.pathData = [firstPoint, secondPoint, thirdPoint];
        // tslint:disable-next-line: prettier
        // tslint:disable-next-line: max-line-length
        selectionServiceSpy.toolActionData.oldSelectionHeight = selectionServiceSpy.toolActionData.oldSelectionWidth = selectionServiceSpy.toolActionData.newSelectionHeight = selectionServiceSpy.toolActionData.newSelectionWidth = 2;
        // tslint:disable-next-line: prettier
        selectionServiceSpy.toolActionData.oldSelectionTopLeftCorner = selectionServiceSpy.toolActionData.newSelectionTopLeftCorner = new Vec2(1, 1);
        selectionServiceSpy.toolActionData.imageData = {} as ImageBitmap;
    });

    describe('updateShapeDataResizing()', () => {
        it('should assign min and max node parameters to selectionService attribute', () => {
            lassoSelectionManager.updateShapeDataResizing();
            expect(selectionServiceSpy.topLeftCorner).toEqual(firstPoint);
            expect(selectionServiceSpy.width).toEqual(secondPoint.x - firstPoint.x);
            expect(selectionServiceSpy.height).toEqual(secondPoint.y - firstPoint.y);
        });

        it('should pass by the first if statement if new coord is smaller than older one', () => {
            selectionServiceSpy.toolActionData.pathData = [new Vec2(10, 10), new Vec2(5, 5)];
            lassoSelectionManager.updateShapeDataResizing();
            expect(selectionServiceSpy.topLeftCorner).toEqual(new Vec2(5, 5));
            expect(selectionServiceSpy.width).toEqual(5);
            expect(selectionServiceSpy.height).toEqual(5);
        });
    });

    describe('drawPerimiter()', () => {
        it('should stroke a lasso', () => {
            lassoSelectionManager['minNode'] = new Vec2(0, 0);
            const lineToSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'lineTo');
            const strokeSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'stroke');
            lassoSelectionManager.drawPerimiter();
            expect(lineToSpy).toHaveBeenCalled();
            expect(strokeSpy).toHaveBeenCalled();
        });
    });

    describe('draw()', () => {
        it('should draw to the preview canvas if drawToBaseCanvas is false', () => {
            const lineToSpy = spyOn<any>(drawServiceSpy.previewCtx, 'lineTo');
            const fillSpy = spyOn<any>(drawServiceSpy.previewCtx, 'fill');
            const drawImageSpy = spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            lassoSelectionManager.draw(false, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
            expect(lineToSpy).toHaveBeenCalled();
        });

        it('should not draw if shouldFillOriginalWhite is false', () => {
            const lineToSpy = spyOn<any>(drawServiceSpy.previewCtx, 'lineTo');
            const fillSpy = spyOn<any>(drawServiceSpy.previewCtx, 'fill');
            const drawImageSpy = spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            selectionServiceSpy.toolActionData.shouldFillOriginalWhite = false;
            lassoSelectionManager.draw(false, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
            expect(lineToSpy).not.toHaveBeenCalled();
        });

        it('should draw to the base canvas if drawToBaseCanvas is true', () => {
            const fillSpy = spyOn<any>(drawServiceSpy.baseCtx, 'fill');
            const drawImageSpy = spyOn<any>(drawServiceSpy.baseCtx, 'drawImage');
            lassoSelectionManager.draw(true, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('should record the action if recordAction is true', () => {
            spyOn<any>(drawServiceSpy.previewCtx, 'lineTo');
            spyOn<any>(drawServiceSpy.previewCtx, 'fill');
            spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            lassoSelectionManager.draw(false, selectionServiceSpy.toolActionData, true);
            expect(undoRedoSpy.addAction).toHaveBeenCalled();
        });
    });

    describe('getImageData()', () => {
        it('should clip the current path', async () => {
            selectionServiceSpy.width = 5;
            selectionServiceSpy.height = 5;
            const lineToSpy = spyOn<any>(drawServiceSpy.previewCtx, 'lineTo');
            const clipSpy = spyOn<any>(drawServiceSpy.previewCtx, 'clip');
            await lassoSelectionManager.getImageData();
            expect(lineToSpy).toHaveBeenCalled();
            expect(clipSpy).toHaveBeenCalled();
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        });
    });
});
