import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AppModule } from '@app/app.module';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { ExportComponent } from '@app/components/export/export.component';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ExportService } from '@app/services/file-options/export.service';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any
describe('ExportComponent', () => {
    let component: ExportComponent;
    let fixture: ComponentFixture<ExportComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ExportComponent>>;
    let formStub: FormBuilder;
    let formControlStub: FormControl;
    let canvasTestHelper: CanvasTestHelper;
    let drawingServiceStub: DrawingService;
    let exportServiceSpy: jasmine.SpyObj<ExportService>;

    beforeEach(() => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef<ExportComponent>', ['close']);
        drawingServiceStub = new DrawingService();
        exportServiceSpy = jasmine.createSpyObj('ExportService', ['applyFilter', 'configureDownloadImage', 'onCancel']);
        formStub = new FormBuilder();
        formControlStub = new FormControl();

        TestBed.configureTestingModule({
            declarations: [ExportComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: FormBuilder, useValue: formStub },
                { provide: FormControl, useValue: formControlStub },
                { provide: ExportService, useValue: exportServiceSpy },
            ],
            imports: [AppModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        exportServiceSpy.downloadCanvas = document.createElement('canvas');
        fixture = TestBed.createComponent(ExportComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('applyFilter()', () => {
        it('should call exportService.applyFilter', () => {
            component.applyFilter();
            expect(exportServiceSpy.applyFilter).toHaveBeenCalled();
        });
    });

    it('downloadImg() should set extension to jpeg anf shoul call configureDownloadImage', () => {
        component.type = 'jpeg';
        component.downloadImg();
        expect(exportServiceSpy.configureDownloadImage).toHaveBeenCalled();
        expect(component.type).toEqual('jpeg');
    });
    it('downloadImg() should set extension to png anf shoul call configureDownloadImage', () => {
        component.type = 'png';
        component.downloadImg();
        expect(exportServiceSpy.configureDownloadImage).toHaveBeenCalled();
        expect(component.type).toEqual('png');
    });

    it('uploadToImgur should call onCancel() and canvasToImage()', () => {
        const cancelSpy = spyOn<any>(component, 'onCancel');
        const canvasToImageSpy = spyOn<any>(component, 'canvasToImage');

        component.uploadToImgur();
        expect(cancelSpy).toHaveBeenCalled();
        expect(canvasToImageSpy).toHaveBeenCalled();
    });
    it('setFinalName() should return the right value', () => {
        (component['form'].get('name') as FormControl).setValue('testName');
        component['setfinalName']();
        expect(component.name.value).toEqual('testName');
    });

    describe('onCancel()', () => {
        it('should close the dialogRef', () => {
            component.onCancel();
            expect(exportServiceSpy.onCancel).toHaveBeenCalled();
        });
    });
    it('canvasToImage should call configureDownloadImage', waitForAsync(async () => {
        component.type = 'jpeg';
        await component['canvasToImage']('jpeg');
        expect(exportServiceSpy.configureDownloadImage).toHaveBeenCalled();
    }));

    it('canvasToImage should call configureDownloadImage', waitForAsync(async () => {
        component.type = 'png';
        await component['canvasToImage']('png');
        expect(exportServiceSpy.configureDownloadImage).toHaveBeenCalled();
    }));

    describe('buttonsDisabled', () => {
        it('should return true if the filtre is not defined', () => {
            fixture = TestBed.createComponent(ExportComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            component.filtre = '';
            component.imgName.setValue('lolol');
            expect(component.buttonsDisabled).toEqual(true);
        });

        it('should return true if the imgName and filtre are not defined', () => {
            fixture = TestBed.createComponent(ExportComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            expect(component.buttonsDisabled).toEqual(true);
        });

        it('should return true if the name is not defined', () => {
            fixture = TestBed.createComponent(ExportComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            component.filtre = 'loloil';
            expect(component.buttonsDisabled).toEqual(true);
        });

        it('should return false if both are defined', () => {
            fixture = TestBed.createComponent(ExportComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();

            component.imgName.setValue('lolol');
            component.filtre = 'lolol';
            expect(component.buttonsDisabled).toEqual(false);
        });
    });

    it('should Change previewCanvasHeight if the ratio of the dimensions of the real canvas is different', () => {
        canvasTestHelper.canvas.width = 10000;
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        exportServiceSpy.downloadCanvas = document.createElement('canvas');
        fixture = TestBed.createComponent(ExportComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        expect(component.previewCanvasWidth).toBeGreaterThan(component.previewCanvasHeight);
    });
});
