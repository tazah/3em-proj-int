import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { SelectionOptionShortcuts } from '@app/constants/file-options.constants';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionState } from '@app/constants/tool.constants';
import { SelectionService } from '@app/services/tools/selection.service';
import { ClipboardService } from './clipboard.service';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
// tslint:disable: no-any
// tslint:disable: no-empty
describe('ClipboardService', () => {
    let service: ClipboardService;
    let selectionServceSpy: jasmine.SpyObj<SelectionService>;

    beforeEach(async () => {
        const rectangleManagerSpy = jasmine.createSpyObj('RectangleSelectionManager', ['updateView']);
        selectionServceSpy = jasmine.createSpyObj('SelectionService', ['onMouseUp', 'finishDrawing'], {
            currentSelectionManager: rectangleManagerSpy,
        });

        TestBed.configureTestingModule({
            providers: [{ provide: SelectionService, useValue: selectionServceSpy }],
        });

        service = TestBed.inject(ClipboardService);
        selectionServceSpy.toolActionData = new SelectionActionData();
        spyOn(SelectionActionData, 'prepareForDelete');
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('cut()', () => {
        it('should call copy and delete', () => {
            const copySpy = spyOn(service, 'copy').and.returnValue(Promise.resolve());
            const deleteSpy = spyOn(service, 'delete');
            service.cut();
            expect(copySpy).toHaveBeenCalled();
            expect(deleteSpy).toHaveBeenCalled();
        });
    });

    describe('paste()', () => {
        it('should do nothing if noSelectionInMemory is true', async () => {
            await service.paste();
            expect(selectionServceSpy.currentSelectionManager.updateView).not.toHaveBeenCalled();
        });

        it('should do call updateView if noSelectionInMemory is false', async () => {
            service.noSelectionInMemory = false;
            const createImageBitmapSpy = spyOn(window, 'createImageBitmap').and.returnValue(Promise.resolve({} as ImageBitmap));
            await service.paste();
            expect(createImageBitmapSpy).toHaveBeenCalled();
            expect(selectionServceSpy.currentSelectionManager.updateView).toHaveBeenCalled();
        });
    });

    describe('copy()', () => {
        it('should do nothing if the selection state is other than SomethingHasBeenSelected', async () => {
            selectionServceSpy.selectionState = SelectionState.Nothing;
            const createImageBitmapSpy = spyOn(window, 'createImageBitmap').and.returnValue(Promise.resolve({} as ImageBitmap));
            await service.copy();
            expect(createImageBitmapSpy).not.toHaveBeenCalled();
        });

        it('should call imageBitmap and set noSelectionInMemory to false', async () => {
            selectionServceSpy.selectionState = SelectionState.SomethingHasBeenSelected;
            const createImageBitmapSpy = spyOn(window, 'createImageBitmap').and.returnValue(Promise.resolve({} as ImageBitmap));
            await service.copy();
            expect(createImageBitmapSpy).toHaveBeenCalled();
            expect(service.noSelectionInMemory).toEqual(false);
        });
    });

    describe('delete()', () => {
        it('should do nothing if the selection state is other than SomethingHasBeenSelected', () => {
            selectionServceSpy.selectionState = SelectionState.Nothing;
            service.delete();
            expect(selectionServceSpy.finishDrawing).not.toHaveBeenCalled();
        });

        it('should call finishDrawing', () => {
            selectionServceSpy.selectionState = SelectionState.SomethingHasBeenSelected;
            selectionServceSpy.toolActionData.imageData = { close: () => {} } as ImageBitmap;
            service.delete();
            expect(selectionServceSpy.finishDrawing).toHaveBeenCalled();
        });
    });

    describe('onKeyDown()', () => {
        it('should do nothing if the event is invalid', () => {
            const deleteSpy = spyOn(service, 'delete');
            const copySpy = spyOn(service, 'copy');
            const cutSpy = spyOn(service, 'cut');
            const pasteSpy = spyOn(service, 'paste');
            service.onKeyDown({ key: 'lol' } as KeyboardEvent);
            expect(deleteSpy).not.toHaveBeenCalled();
            expect(copySpy).not.toHaveBeenCalled();
            expect(cutSpy).not.toHaveBeenCalled();
            expect(pasteSpy).not.toHaveBeenCalled();
        });

        it('should call delete if the key is delete', () => {
            const deleteSpy = spyOn(service, 'delete');
            const copySpy = spyOn(service, 'copy');
            const cutSpy = spyOn(service, 'cut');
            const pasteSpy = spyOn(service, 'paste');
            service.onKeyDown({ key: KeyboardButton.Delete } as KeyboardEvent);
            expect(deleteSpy).toHaveBeenCalled();
            expect(copySpy).not.toHaveBeenCalled();
            expect(cutSpy).not.toHaveBeenCalled();
            expect(pasteSpy).not.toHaveBeenCalled();
        });

        it('should call copy if the key is the copy key', () => {
            const deleteSpy = spyOn(service, 'delete');
            const copySpy = spyOn(service, 'copy');
            const cutSpy = spyOn(service, 'cut');
            const pasteSpy = spyOn(service, 'paste');
            service.onKeyDown({ key: SelectionOptionShortcuts.Copy } as KeyboardEvent);
            expect(deleteSpy).not.toHaveBeenCalled();
            expect(copySpy).toHaveBeenCalled();
            expect(cutSpy).not.toHaveBeenCalled();
            expect(pasteSpy).not.toHaveBeenCalled();
        });

        it('should call cut if the key is the cut key', () => {
            const deleteSpy = spyOn(service, 'delete');
            const copySpy = spyOn(service, 'copy');
            const cutSpy = spyOn(service, 'cut');
            const pasteSpy = spyOn(service, 'paste');
            service.onKeyDown({ key: SelectionOptionShortcuts.Cut } as KeyboardEvent);
            expect(deleteSpy).not.toHaveBeenCalled();
            expect(copySpy).not.toHaveBeenCalled();
            expect(cutSpy).toHaveBeenCalled();
            expect(pasteSpy).not.toHaveBeenCalled();
        });

        it('should call paste if the key is the paste key', () => {
            const deleteSpy = spyOn(service, 'delete');
            const copySpy = spyOn(service, 'copy');
            const cutSpy = spyOn(service, 'cut');
            const pasteSpy = spyOn(service, 'paste');
            service.onKeyDown({ key: SelectionOptionShortcuts.Paste } as KeyboardEvent);
            expect(deleteSpy).not.toHaveBeenCalled();
            expect(copySpy).not.toHaveBeenCalled();
            expect(cutSpy).not.toHaveBeenCalled();
            expect(pasteSpy).toHaveBeenCalled();
        });
    });
});
