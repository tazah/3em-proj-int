import { TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { SaveDrawingComponent } from '@app/components/save-drawing/save-drawing.component';
import { NetworkService } from '@app/services/network/network.service';
import { SaveDrawingService } from './save-drawing.service';

/* tslint:disable */
describe('SaveDrawingService', () => {
    let service: SaveDrawingService;
    let networkServiceStub: jasmine.SpyObj<NetworkService>;
    let canvasTester: CanvasTestHelper;
    let previewCtxStub: CanvasRenderingContext2D;

    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SaveDrawingComponent>>;

    beforeEach(() => {
        networkServiceStub = jasmine.createSpyObj('NetworkService', ['sendDrawing']);
        canvasTester = new CanvasTestHelper();
        previewCtxStub = canvasTester.drawCanvas.getContext('2d') as CanvasRenderingContext2D;
        dialogRefSpy = jasmine.createSpyObj('MatDialog', ['close']);

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [{ provide: NetworkService, useValue: networkServiceStub }],
        });
        service = TestBed.inject(SaveDrawingService);
        service.originalCanvas = canvasTester.canvas;
        service.previewCanvas = canvasTester.drawCanvas;
        service.previewCtx = previewCtxStub;

        service.dialogRef = dialogRefSpy;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('onSave()', () => {
        it('should call sendDrawing of networkService', () => {
            service.onSave('title', ['tagExemple'], true);
            expect(networkServiceStub.sendDrawing).toHaveBeenCalled();
        });

        it('should call sendDrawing of networkService with a JPEG img', () => {
            const toDataURLSpy = spyOn<any>(service.previewCanvas, 'toDataURL').and.callThrough();
            service.onSave('title', ['tagExemple'], false);
            expect(networkServiceStub.sendDrawing).toHaveBeenCalled();
            expect(toDataURLSpy).toHaveBeenCalledWith('image/jpeg', 1.0);
        });
    });

    describe('onCancel()', () => {
        it('should call dialogRef.close', () => {
            service.onCancel();
            expect(dialogRefSpy.close).toHaveBeenCalled();
        });
    });
});
