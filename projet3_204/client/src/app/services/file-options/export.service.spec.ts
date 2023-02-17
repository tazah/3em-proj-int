import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ExportComponent } from '@app/components/export/export.component';
import { ExportService } from '@app/services/file-options/export.service';

/* tslint:disable */
describe('ExportService', () => {
    let service: ExportService;
    let canvasTester: CanvasTestHelper;
    let previewCtxStub: CanvasRenderingContext2D;
    let filtreStub: string;

    let dialogSpy: jasmine.SpyObj<MatDialogRef<ExportComponent>>;

    beforeEach(() => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['close']);

        canvasTester = new CanvasTestHelper();
        previewCtxStub = canvasTester.canvas.getContext('2d') as CanvasRenderingContext2D;

        TestBed.configureTestingModule({});
        service = TestBed.inject(ExportService);
        service.previewCtx = previewCtxStub;
        service.previewCanvas = canvasTester.canvas;
        service.originalCanvas = canvasTester.canvas;
        service.dialogRef = dialogSpy;
        service.previewCanvas.style.filter = service['filtre'];
        service.previewCtx.filter = service['filtre'];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('setFilter should set this.filter to the corresponding filter ', () => {
        filtreStub = 'blur(10px)';
        service.setFilter(filtreStub);
        expect(service['filtre']).toEqual(filtreStub);
        expect(service.previewCtx.filter).toEqual(service['filtre']);
    });

    it('applyFilter call setfilter with the Brouillé filter', () => {
        const setFilterSpy = spyOn<any>(service, 'setFilter');
        filtreStub = 'Brouillé';
        service.applyFilter(filtreStub);
        expect(setFilterSpy).toHaveBeenCalled();
    });
    it('applyFilter call setfilter with the none filter', () => {
        const setFilterSpy = spyOn<any>(service, 'setFilter');
        filtreStub = 'Aucun filtre';
        service.applyFilter(filtreStub);
        expect(setFilterSpy).toHaveBeenCalled();
    });
    it('applyFilter call setfilter with the Opacité filter', () => {
        const setFilterSpy = spyOn<any>(service, 'setFilter');
        filtreStub = 'Inversion des couleurs';
        service.applyFilter(filtreStub);
        expect(setFilterSpy).toHaveBeenCalled();
    });
    it('applyFilter call setfilter with the Invert filter', () => {
        const setFilterSpy = spyOn<any>(service, 'setFilter');
        filtreStub = 'Hue-rotation';
        service.applyFilter(filtreStub);
        expect(setFilterSpy).toHaveBeenCalled();
    });
    it('applyFilter call setfilter with the Sepia filter', () => {
        const setFilterSpy = spyOn<any>(service, 'setFilter');
        filtreStub = 'Sepia';
        service.applyFilter(filtreStub);
        expect(setFilterSpy).toHaveBeenCalled();
    });
    it('applyFilter call setfilter with the Contrast filter', () => {
        const setFilterSpy = spyOn<any>(service, 'setFilter');
        filtreStub = 'Contrast';
        service.applyFilter(filtreStub);
        expect(setFilterSpy).toHaveBeenCalled();
    });
    it('applyFilter shouldnt call setfilter with another filter', () => {
        const setFilterSpy = spyOn<any>(service, 'setFilter');
        filtreStub = 'Not known filter';
        service.applyFilter(filtreStub);
        expect(setFilterSpy).not.toHaveBeenCalled();
    });
    it('configureImage sets the downloadCanvas', () => {
        service['filtre'] = 'sepia(100%)';
        service.configureDownloadImage();
        expect(service.downloadCanvas).toBeDefined();
        expect(service.downloadCanvas.width).toEqual(service.originalCanvas.width);
        expect(service.downloadCanvas.height).toEqual(service.originalCanvas.height);
        expect(service.downloadCtx.filter).toEqual(service['filtre']);
    });
    it('onCancel should close the dialog', () => {
        service.onCancel();
        expect(dialogSpy.close).toHaveBeenCalled();
    });
});
