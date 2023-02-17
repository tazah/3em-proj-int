import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { ExportComponent } from '@app/components/export/export.component';
import { FileOptionShortcuts } from '@app/constants/file-options.constants';
import { DialogService } from '@app/services/dialog/dialog.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { of } from 'rxjs';

// tslint:disable
describe('DialogService', () => {
    let service: DialogService;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let undoRedoStub: UndoRedoService = new UndoRedoService(new DrawingService());

    let dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null, addPanelClass: (value: string) => {} });
    dialogRefSpyObj.componentInstance = { body: '' };

    beforeEach(() => {
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'afterClosed']);
        TestBed.configureTestingModule({
            providers: [
                { provide: MatDialog, useValue: dialogSpy },
                { provide: UndoRedoService, useValue: undoRedoStub },
            ],
        });
        service = TestBed.inject(DialogService);
        dialogRefSpyObj.componentInstance = { body: '' };
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });

    it('constructDialog should open a dialog', () => {
        service.constructDialog(ExportComponent);
        expect(dialogSpy.open).toHaveBeenCalled();
    });

    it('switchDialog shouldnt call constructDialog if ctrl+E is pressed and actions done pile is empty', () => {
        undoRedoStub.actionsDone.length = 0;
        const constructdialogSpy = spyOn<any>(service, 'constructDialog').and.returnValue(dialogRefSpyObj);
        service.switchDialog(FileOptionShortcuts.ExportDrawing);
        expect(constructdialogSpy).not.toHaveBeenCalled();
    });

    it('switchDialog should call constructDialog if ctrl+E is pressed and actions done pile is not empty', () => {
        undoRedoStub.actionsDone.length = 3;
        const constructdialogSpy = spyOn<any>(service, 'constructDialog').and.returnValue(dialogRefSpyObj);
        service.switchDialog(FileOptionShortcuts.ExportDrawing);
        expect(constructdialogSpy).toHaveBeenCalled();
        expect(service.disableKeys).toEqual(false);
    });

    it('switchDialog should call constructDialog if ctrl+O is pressed and actions done pile is not empty', () => {
        undoRedoStub.actionsDone.length = 3;
        const constructdialogSpy = spyOn<any>(service, 'constructDialog').and.returnValue(dialogRefSpyObj);
        service.switchDialog(FileOptionShortcuts.CreateNewDrawing);
        expect(constructdialogSpy).toHaveBeenCalled();
        expect(service.disableKeys).toEqual(false);
    });
    it('switchDialog should call constructDialog if ShowCarousel key is pressed is pressed and actions done pile is not empty', () => {
        undoRedoStub.actionsDone.length = 3;
        const constructdialogSpy = spyOn<any>(service, 'constructDialog').and.returnValue(dialogRefSpyObj);
        service.switchDialog(FileOptionShortcuts.ShowCarousel);
        expect(constructdialogSpy).toHaveBeenCalled();
        expect(service.disableKeys).toEqual(false);
    });
    it('switchDialog should call constructDialog if SaveDrawing key is pressed is pressed and actions done pile is not empty', () => {
        undoRedoStub.actionsDone.length = 3;
        const constructdialogSpy = spyOn<any>(service, 'constructDialog').and.returnValue(dialogRefSpyObj);
        service.switchDialog(FileOptionShortcuts.SaveDrawing);
        expect(constructdialogSpy).toHaveBeenCalled();
        expect(service.disableKeys).toEqual(false);
    });

    it('switchDialog should afterClosed if constructDialog was called', () => {
        spyOn<any>(service, 'constructDialog').and.returnValue(dialogRefSpyObj);
        service.switchDialog(FileOptionShortcuts.CreateNewDrawing);
        expect(service.disableKeys).toEqual(false);
    });
});
