import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Vec2 } from '@app/classes/vec2';
import { MIN_HEIGHT, MIN_WIDTH } from '@app/constants/style.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { of } from 'rxjs';
import { NewDrawingService } from './new-drawing.service';

/* tslint:disable */
describe('NewDrawingService', () => {
    let service: NewDrawingService;
    let drawingServiceStub: DrawingService;
    let resizingServiceStub: ResizingService;
    let undoServiceStub: UndoRedoService;
    let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
    dialogRefSpyObj.componentInstance = { body: '' };

    beforeEach(() => {
        drawingServiceStub = new DrawingService();
        undoServiceStub = new UndoRedoService(drawingServiceStub);
        resizingServiceStub = new ResizingService(undoServiceStub);

        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [{ provide: ResizingService, useValue: resizingServiceStub }],
        });
        service = TestBed.inject(NewDrawingService);

        resizingServiceStub.previewCanvasSize = new Vec2(0,0);
        resizingServiceStub.canvasSize = new Vec2(0,0);
        service.dialogRef = dialogRefSpyObj;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('initialSize should set previewCanvasSize to half of the window size if it is bigger than 250px ', () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 900 });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 900 });
        service.initialSize();
        expect(service['resizingService'].previewCanvasSize.x).toEqual(window.innerWidth / 2);
        expect(service['resizingService'].previewCanvasSize.y).toEqual(window.innerHeight / 2);
        expect(service['resizingService'].canvasSize.x).toEqual(window.innerWidth / 2);
        expect(service['resizingService'].canvasSize.y).toEqual(window.innerHeight / 2);
    });

    it('initialSize should set canvasSize to MIN_HEIGHT and MIN_WIDTH if it is bigger than 250px', () => {
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 100 });
        Object.defineProperty(window, 'innerHeight', { writable: true, configurable: true, value: 200 });
        service.initialSize();
        expect(service['resizingService'].previewCanvasSize.x).toEqual(MIN_WIDTH);
        expect(service['resizingService'].previewCanvasSize.y).toEqual(MIN_HEIGHT);
        expect(service['resizingService'].canvasSize.x).toEqual(MIN_WIDTH);
        expect(service['resizingService'].canvasSize.y).toEqual(MIN_HEIGHT);
    });
    it('onCancel should close the dialog', () => {
        service.onCancel();
        expect(dialogRefSpyObj.close).toHaveBeenCalled();
    });
});
