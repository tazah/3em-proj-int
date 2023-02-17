import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { CarrouselComponent } from '@app/components/carrousel/carrousel.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NetworkService } from '@app/services/network/network.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Drawing } from '@common/classes/drawing';
import { CarrouselService } from './carrousel.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty
describe('CarrouselService', () => {
    let service: CarrouselService;
    let snakeBarMock: jasmine.SpyObj<MatSnackBar>;
    let drawingServiceStub: jasmine.SpyObj<DrawingService>;
    let resizeServiceStub: jasmine.SpyObj<ResizingService>;
    let canvasTestHelper: CanvasTestHelper;
    let undoRedoStub: jasmine.SpyObj<UndoRedoService>;

    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CarrouselComponent>>;

    beforeEach(() => {
        snakeBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);
        dialogRefSpy = jasmine.createSpyObj('MatDialog', ['close']);
        drawingServiceStub = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        resizeServiceStub = jasmine.createSpyObj('ResizingService', ['setSize', 'resetCanvasDims']);
        undoRedoStub = jasmine.createSpyObj('ResizingService', ['reset']);

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                { provide: NetworkService, useValue: { getAllDrawings: () => {}, deleteDrawing: (...args: any) => {} } as NetworkService },
                { provide: MatSnackBar, useValue: snakeBarMock },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: ResizingService, useValue: resizeServiceStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
            ],
        });
        canvasTestHelper = TestBed.inject(CanvasTestHelper);

        resizeServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        resizeServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        drawingServiceStub.baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        drawingServiceStub.previewCtx = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(CarrouselService);

        service.dialogRef = dialogRefSpy;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('loadImageFromServer()', () => {
        it('should get all drawings', async () => {
            const getAllDrawingsSpy = spyOn<any>(service['networkService'], 'getAllDrawings').and.returnValue(Promise.resolve());
            await service.loadImagesFromServer();
            expect(getAllDrawingsSpy).toHaveBeenCalled();
        });

        it('should print any error messages in the snackBar', async () => {
            const getAllDrawingsSpy = spyOn<any>(service['networkService'], 'getAllDrawings').and.returnValue(
                Promise.reject(new HttpErrorResponse({ error: 'error' })),
            );
            service
                .loadImagesFromServer()
                .then(() => {
                    expect(getAllDrawingsSpy).toHaveBeenCalled();
                })
                .catch((err: HttpErrorResponse) => {
                    expect(err.error).toEqual('error');
                });
        });
    });

    describe('filterDrawings()', () => {
        it('should push drawing if the tag is present ', () => {
            const d1 = { _id: '1', title: 'titre 1', tags: ['tag1', 'tag2'], image: '' };
            service.drawings.push(d1);
            service.filterDrawings(['tag5', 'tag1']);
            expect(service.filterDrawings.length).toEqual(1);
        });
    });

    describe('deleteDrawing()', () => {
        it('should delete drawing from networkService', async () => {
            const deleteDrawingSpy = spyOn<any>(service['networkService'], 'deleteDrawing').and.returnValue(Promise.resolve());
            await service.deleteDrawing({} as Drawing);
            expect(deleteDrawingSpy).toHaveBeenCalled();
        });
    });

    describe('onCancel()', () => {
        it('should call dialogRef.close', () => {
            service.onCancel();
            expect(dialogRefSpy.close).toHaveBeenCalled();
        });
    });

    describe('continueDrawing()', () => {
        it('should warn client if a drawing is already on the canvas and return if client pressed cancel', () => {
            undoRedoStub.savedDrawingAvailable = true;
            const onCancelSpy = spyOn<any>(service, 'onCancel');
            const confirmSpy = spyOn<any>(window, 'confirm').and.returnValue(false);

            service.continueDrawing('drawingUrl');

            expect(confirmSpy).toHaveBeenCalledWith('Attention! Le dessin actuel sera supprimé, voulez-vous continuer?');
            expect(onCancelSpy).not.toHaveBeenCalled();
        });

        it('should warn client if a drawing is already on the canvas and continue if client pressed ok', () => {
            undoRedoStub.savedDrawingAvailable = true;
            const onCancelSpy = spyOn<any>(service, 'onCancel');
            const confirmSpy = spyOn<any>(window, 'confirm').and.returnValue(true);
            const testImg = new Image();
            spyOn(window, 'Image').and.returnValue(testImg as any);

            service.continueDrawing('drawingUrl');

            expect(confirmSpy).toHaveBeenCalledWith('Attention! Le dessin actuel sera supprimé, voulez-vous continuer?');
            expect(testImg.onload).toBeDefined();
            testImg.onload?.({} as Event);
            expect(onCancelSpy).toHaveBeenCalled();
        });

        it('should call onCancel, drawImage, setSize, reset, clearCanvas', () => {
            const onCancelSpy = spyOn<any>(service, 'onCancel');
            const testImg = new Image();
            spyOn(window, 'Image').and.returnValue(testImg as any);
            service.continueDrawing('drawingUrl');
            expect(testImg.onload).toBeDefined();
            testImg.onload?.({} as Event);
            expect(onCancelSpy).toHaveBeenCalled();
        });
    });
});
