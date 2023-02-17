import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { AppModule } from '@app/app.module';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { EXPORT_PREVIEW_WIDTH } from '@app/constants/file-options.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SaveDrawingService } from '@app/services/file-options/save-drawing.service';
import { SaveDrawingComponent } from './save-drawing.component';

// tslint:disable: no-magic-numbers no-string-literal
describe('SaveDrawingComponent', () => {
    let component: SaveDrawingComponent;
    let fixture: ComponentFixture<SaveDrawingComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<SaveDrawingComponent>>;
    let drawingServiceStub: DrawingService;
    let canvasTestHelper: CanvasTestHelper;
    let saveDrawingServiceSpy: jasmine.SpyObj<SaveDrawingService>;
    let formStub: FormBuilder;
    beforeEach(() => {
        drawingServiceStub = new DrawingService();
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef<SaveDrawingComponent>', ['close']);
        saveDrawingServiceSpy = jasmine.createSpyObj('SaveDrawingService', ['onCancel', 'onSave', 'remove', 'add', 'drawImage']);
        formStub = new FormBuilder();

        TestBed.configureTestingModule({
            declarations: [SaveDrawingComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: SaveDrawingService, useValue: saveDrawingServiceSpy },
                { provide: DrawingService, useValue: drawingServiceStub },
                { provide: FormBuilder, useValue: formStub },
            ],
            imports: [AppModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingServiceStub.canvas = canvasTestHelper.canvas;
        saveDrawingServiceSpy.originalCanvas = document.createElement('canvas');
        fixture = TestBed.createComponent(SaveDrawingComponent);

        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should reset the input value', () => {
        const inputTest = document.createElement('input') as HTMLInputElement;
        const valueTest = 'hello';
        inputTest.value = 'input';
        const event: MatChipInputEvent = {
            input: inputTest,
            value: valueTest,
        };
        component.add(event);
        expect(event.input.value).toEqual('');
    });

    it('should be initialized with the correct canvas ratio', () => {
        canvasTestHelper.canvas.width = 1000;
        fixture = TestBed.createComponent(SaveDrawingComponent);
        component = fixture.componentInstance;
        expect(component.previewCanvasHeight).toEqual((drawingServiceStub.canvas.height * EXPORT_PREVIEW_WIDTH) / drawingServiceStub.canvas.width);
    });

    describe('add()', () => {
        it('should add a tag', () => {
            const inputTest = {} as HTMLInputElement;
            const valueTest = 'hello';
            const event: MatChipInputEvent = {
                input: inputTest,
                value: valueTest,
            };
            component.tags = ['test', 'bye'];
            component.add(event);
            expect(component.tags.length).toEqual(3);
        });

        it('should add a tag', () => {
            const inputTest = {} as HTMLInputElement;
            const valueTest = '';
            const event: MatChipInputEvent = {
                input: inputTest,
                value: valueTest,
            };
            component.tags = ['test', 'bye'];
            component.add(event);
            expect(component.tags.length).not.toEqual(3);
        });

        it('should not set input value as an empty string if it is undefined', () => {
            const valueTest = '';
            const event: MatChipInputEvent = {
                input: (undefined as unknown) as HTMLInputElement,
                value: valueTest,
            };
            component.tags = ['test', 'bye'];
            component.add(event);
            expect(event.input).toBeUndefined();
        });
    });

    describe('remove()', () => {
        it('should remove tag', () => {
            component.tags = ['test', 'hello'];
            component.remove('hola');
            expect(component.tags[0]).toEqual('test');
        });

        it('should remove tag', () => {
            component.tags = ['test', 'hello'];
            component.remove('test');
            expect(component.tags[0]).toEqual('hello');
        });
    });

    describe('onCancel()', () => {
        it('should close the dialogRef', () => {
            component.onCancel();
            expect(saveDrawingServiceSpy.onCancel).toHaveBeenCalled();
        });
    });

    describe('onSave()', () => {
        it('should save the name and tag and close the dialogRef', () => {
            component.onSave(true);
            component.onCancel();
            expect(saveDrawingServiceSpy.onCancel).toHaveBeenCalled();
            expect(saveDrawingServiceSpy.onSave).toHaveBeenCalled();
        });
    });

    describe('isValidTag()', () => {
        it('should not add the tag if it is already included in tags list', () => {
            const value = 'tag';
            component.tags.push(value);
            component['isValidTag'](value);
            expect(component.tags.length).toEqual(1);
        });
    });
});
