import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AppModule } from '@app/app.module';
import { ToolTest } from '@app/classes/tool-test';
import { FileOptionShortcuts } from '@app/constants/file-options.constants';
import { ToolKey } from '@app/constants/tool.constants';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { ColorService } from '@app/services/color/color.service';
import { DialogService } from '@app/services/dialog/dialog.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { SidebarComponent } from './sidebar.component';

@Component({
    selector: 'mat-icon',
    template: '<span></span>',
})
class MockMatIconComponent {
    @Input() svgIcon: string;
    @Input() fontSet: string;
    @Input() fontIcon: string;
}

describe('SidebarComponent', () => {
    let component: SidebarComponent;
    let fixture: ComponentFixture<SidebarComponent>;
    let toolSwitcherServiceSpy: jasmine.SpyObj<ToolSwitcherService>;
    let dialogServiceSpy: jasmine.SpyObj<DialogService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let clipBoadServiceSpy: jasmine.SpyObj<ClipboardService>;

    beforeEach(() => {
        toolSwitcherServiceSpy = jasmine.createSpyObj('ToolSwitcherService', ['switchTool']);
        dialogServiceSpy = jasmine.createSpyObj('DialogService', ['switchDialog']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['undo', 'redo']);
        clipBoadServiceSpy = jasmine.createSpyObj('ClipboardService', ['copy', 'paste', 'cut', 'delete']);
        undoRedoServiceSpy.actionsDone = [];
        undoRedoServiceSpy.actionsUndone = [];

        toolSwitcherServiceSpy.currentService = new ToolTest(new DrawingService(), new ColorService(), undoRedoServiceSpy);

        TestBed.configureTestingModule({
            declarations: [SidebarComponent],
            providers: [
                { provide: ToolSwitcherService, useValue: toolSwitcherServiceSpy },
                { provide: DialogService, useValue: dialogServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
                { provide: ClipboardService, useValue: clipBoadServiceSpy },
            ],
            imports: [AppModule, MatIconModule],
        }) // Inspired from https://stackoverflow.com/a/55528306
            .overrideModule(MatIconModule, {
                remove: {
                    declarations: [MatIcon],
                    exports: [MatIcon],
                },
                add: {
                    declarations: [MockMatIconComponent],
                    exports: [MockMatIconComponent],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SidebarComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should switch tool when passed to the onClick function', () => {
        component.onClick(ToolKey.Mouse);
        expect(toolSwitcherServiceSpy.switchTool).toHaveBeenCalledWith(ToolKey.Mouse);
    });

    it('it should open the dialog', () => {
        component.openDialog({} as FileOptionShortcuts);
        expect(dialogServiceSpy.switchDialog).toHaveBeenCalledWith({} as FileOptionShortcuts);
    });

    it('Should call the undoRedoService undo when undo is called', () => {
        component.undo();
        expect(undoRedoServiceSpy.undo).toHaveBeenCalled();
    });

    it('Should call the undoRedoService redo when redo is called', () => {
        component.redo();
        expect(undoRedoServiceSpy.redo).toHaveBeenCalled();
    });

    it('isUsingTool should return current service started variable value', () => {
        const expected = toolSwitcherServiceSpy.currentService.started;
        const value = component.isUsingTool;
        expect(value).toEqual(expected);
    });

    describe('copy()', () => {
        it('should call the clipBoadService s copy', () => {
            component.copy();
            expect(clipBoadServiceSpy.copy).toHaveBeenCalled();
        });
    });

    describe('cut()', () => {
        it('should call the clipBoadService s cut', () => {
            component.cut();
            expect(clipBoadServiceSpy.cut).toHaveBeenCalled();
        });
    });

    describe('delete()', () => {
        it('should call the clipBoadService s delete', () => {
            component.delete();
            expect(clipBoadServiceSpy.delete).toHaveBeenCalled();
        });
    });

    describe('paste()', () => {
        it('should call the clipBoadService s paste', () => {
            component.paste();
            expect(clipBoadServiceSpy.paste).toHaveBeenCalled();
        });
    });
});
