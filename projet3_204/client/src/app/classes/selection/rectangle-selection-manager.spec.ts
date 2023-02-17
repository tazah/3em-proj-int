import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { RectangleSelectionManager } from './rectangle-selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty
describe('RectangleSelectionManager', () => {
    let rectangleSelectionManager: RectangleSelectionManager;
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
        rectangleSelectionManager = new RectangleSelectionManager(selectionServiceSpy, drawServiceSpy, undoRedoSpy);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        rectangleSelectionManager['drawingService'].baseCtx = baseCtxStub;
        rectangleSelectionManager['drawingService'].previewCtx = previewCtxStub;
        rectangleSelectionManager['drawingService'].canvas = canvasTestHelper.canvas;
        rectangleSelectionManager['drawingService'].selectionBoxCtx = baseCtxStub;

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
        // tslint:disable-next-line: max-line-length
        selectionServiceSpy.toolActionData.oldSelectionHeight = selectionServiceSpy.toolActionData.oldSelectionWidth = selectionServiceSpy.toolActionData.newSelectionHeight = selectionServiceSpy.toolActionData.newSelectionWidth = 2;
        // tslint:disable-next-line: prettier
        selectionServiceSpy.toolActionData.oldSelectionTopLeftCorner = selectionServiceSpy.toolActionData.newSelectionTopLeftCorner = new Vec2(1, 1);
        selectionServiceSpy.toolActionData.imageData = {} as ImageBitmap;
    });

    describe('drawPerimiter()', () => {
        it('should save and restore the canvas state', () => {
            const saveSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'save');
            const restoreSpy = spyOn<any>(drawServiceSpy.selectionBoxCtx, 'restore');
            rectangleSelectionManager.drawPerimiter();
            expect(saveSpy).toHaveBeenCalled();
            expect(restoreSpy).toHaveBeenCalled();
        });
    });

    describe('draw()', () => {
        it('should draw to the preview canvas if drawToBaseCanvas is false', () => {
            const fillRectSpy = spyOn<any>(drawServiceSpy.previewCtx, 'fillRect');
            const drawImageSpy = spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            rectangleSelectionManager.draw(false, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(fillRectSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
        });

        it('should draw to the base canvas if drawToBaseCanvas is true', () => {
            const fillRectSpy = spyOn<any>(drawServiceSpy.baseCtx, 'fillRect');
            const drawImageSpy = spyOn<any>(drawServiceSpy.baseCtx, 'drawImage');
            rectangleSelectionManager.draw(true, selectionServiceSpy.toolActionData, false);
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
            expect(fillRectSpy).toHaveBeenCalled();
            expect(drawImageSpy).toHaveBeenCalled();
        });

        it('should record the action if recordAction is true', () => {
            spyOn<any>(drawServiceSpy.previewCtx, 'fillRect');
            spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            rectangleSelectionManager.draw(false, selectionServiceSpy.toolActionData, true);
            expect(undoRedoSpy.addAction).toHaveBeenCalled();
        });

        it('should not call fillRect if shouldFillOriginalWhite is false', () => {
            const fillRectSpy = spyOn<any>(drawServiceSpy.baseCtx, 'fillRect');
            selectionServiceSpy.toolActionData.shouldFillOriginalWhite = false;
            rectangleSelectionManager.draw(true, selectionServiceSpy.toolActionData, false);
            expect(fillRectSpy).not.toHaveBeenCalled();
        });
    });

    describe('getImageData()', () => {
        it('should draw an image and get the image data', async () => {
            selectionServiceSpy.width = 5;
            selectionServiceSpy.height = 5;
            const drawImageSpy = spyOn<any>(drawServiceSpy.previewCtx, 'drawImage');
            const getImageDataSpy = spyOn<any>(drawServiceSpy.previewCtx, 'getImageData').and.callThrough();
            await rectangleSelectionManager.getImageData();
            expect(drawImageSpy).toHaveBeenCalled();
            expect(getImageDataSpy).toHaveBeenCalled();
            expect(drawServiceSpy.clearCanvas).toHaveBeenCalled();
        });
    });
});
