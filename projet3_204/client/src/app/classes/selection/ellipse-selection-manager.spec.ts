import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EllipseSelectionManager } from './ellipse-selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty
describe('EllipseSelectionManager', () => {
    let ellipseSelectionManager: EllipseSelectionManager;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoSpy: jasmine.SpyObj<UndoRedoService>;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['selectAllCanvas']);
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);

        TestBed.configureTestingModule({});
        ellipseSelectionManager = new EllipseSelectionManager(selectionServiceSpy, drawServiceSpy, undoRedoSpy);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        ellipseSelectionManager['drawingService'].baseCtx = baseCtxStub;
        ellipseSelectionManager['drawingService'].previewCtx = previewCtxStub;
        ellipseSelectionManager['drawingService'].canvas = canvasTestHelper.canvas;
        ellipseSelectionManager['drawingService'].selectionBoxCtx = baseCtxStub;

        selectionServiceSpy.selectionState = SelectionState.Nothing;
        selectionServiceSpy.arrowsPressed = new Map([
            [KeyboardButton.ArrowLeft, false],
            [KeyboardButton.ArrowRight, false],
            [KeyboardButton.ArrowUp, false],
            [KeyboardButton.ArrowDown, false],
        ]);

        selectionServiceSpy.topLeftCorner = new Vec2(1, 1);
        selectionServiceSpy.toolActionData = new SelectionActionData();
        // tslint:disable-next-line: prettier
        selectionServiceSpy.toolActionData.oldSelectionHeight
            = selectionServiceSpy.toolActionData.oldSelectionWidth
            = selectionServiceSpy.toolActionData.newSelectionHeight
            = selectionServiceSpy.toolActionData.newSelectionWidth
            = 2;
        // tslint:disable-next-line: prettier
        selectionServiceSpy.toolActionData.oldSelectionTopLeftCorner
            = selectionServiceSpy.toolActionData.newSelectionTopLeftCorner
            = new Vec2(1, 1);
        selectionServiceSpy.toolActionData.imageData = {} as ImageBitmap;
    });

    describe('drawPerimiter()', () => {
        it('should stroke an ellipse', () => {
            const ellipseSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'ellipse');
            const strokeSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'stroke');
            ellipseSelectionManager.drawPerimiter();
            expect(ellipseSpy).toHaveBeenCalled();
            expect(strokeSpy).toHaveBeenCalled();
        });
    });

    describe('draw()', () => {
        it('should draw to the preview canvas if drawToBaseCanvas is false', () => {
            const ellipseSpy = spyOn<any>(drawServiceSpy.previewCtx, 'ellipse');
            const fillSpy = spyOn<any>(drawServiceSpy.previewCtx, 'fill');
            const drawImageSpy = spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            ellipseSelectionManager.draw(false, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(ellipseSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('should draw to the base canvas if drawToBaseCanvas is true', () => {
            const ellipseSpy = spyOn<any>(drawServiceSpy.baseCtx, 'ellipse');
            const fillSpy = spyOn<any>(drawServiceSpy.baseCtx, 'fill');
            const drawImageSpy = spyOn<any>(drawServiceSpy.baseCtx, 'drawImage');
            ellipseSelectionManager.draw(true, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(ellipseSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('should not draw an ellipse if shouldFillOriginalWhite is false', () => {
            const ellipseSpy = spyOn<any>(drawServiceSpy.baseCtx, 'ellipse');
            const fillSpy = spyOn<any>(drawServiceSpy.baseCtx, 'fill');
            const drawImageSpy = spyOn<any>(drawServiceSpy.baseCtx, 'drawImage');
            selectionServiceSpy.toolActionData.shouldFillOriginalWhite = false;
            ellipseSelectionManager.draw(true, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(ellipseSpy).not.toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(fillSpy).toHaveBeenCalled();
        });

        it('should record the action if recordAction is true', () => {
            spyOn<any>(drawServiceSpy.previewCtx, 'ellipse');
            spyOn<any>(drawServiceSpy.previewCtx, 'fill');
            spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            ellipseSelectionManager.draw(false, selectionServiceSpy.toolActionData, true);
            expect(undoRedoSpy.addAction).toHaveBeenCalled();
        });

        it('should set the oldSelection width and height to 2 if lower than 2', () => {
            spyOn<any>(drawServiceSpy.previewCtx, 'ellipse');
            spyOn<any>(drawServiceSpy.previewCtx, 'fill');
            spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            selectionServiceSpy.toolActionData.oldSelectionWidth = 1;
            selectionServiceSpy.toolActionData.oldSelectionHeight = 1;
            ellipseSelectionManager.draw(false, selectionServiceSpy.toolActionData, true);
            expect(selectionServiceSpy.toolActionData.oldSelectionWidth).toEqual(2);
            expect(selectionServiceSpy.toolActionData.oldSelectionHeight).toEqual(2);
        });
    });

    describe('getImageData()', () => {
        it('should clip an ellipse', async () => {
            selectionServiceSpy.width = 5;
            selectionServiceSpy.height = 5;
            const ellipseSpy = spyOn<any>(drawServiceSpy.previewCtx, 'ellipse');
            const clipSpy = spyOn<any>(drawServiceSpy.previewCtx, 'clip');
            await ellipseSelectionManager.getImageData();
            expect(ellipseSpy).toHaveBeenCalled();
            expect(clipSpy).toHaveBeenCalled();
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        });
    });
});
