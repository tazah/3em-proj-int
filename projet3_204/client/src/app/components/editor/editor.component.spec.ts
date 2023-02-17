import { ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { DrawingComponent } from '@app/components/drawing/drawing.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ToolKey } from '@app/constants/tool.constants';
import { KeypressHandlerService } from '@app/services/keypress-handler/keypress-handler.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { PencilService } from '@app/services/tools/pencil.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { EditorComponent } from './editor.component';

// tslint:disable: no-string-literal
describe('EditorComponent', () => {
    let component: EditorComponent;
    let fixture: ComponentFixture<EditorComponent>;
    let toolSwitcherServiceSpy: jasmine.SpyObj<ToolSwitcherService>;
    let keypressHandlerServiceSpy: jasmine.SpyObj<KeypressHandlerService>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(() => {
        toolSwitcherServiceSpy = jasmine.createSpyObj('ToolSwitcherService', ['switchTool'], {
            currentService: jasmine.createSpyObj('RectangleService', ['onSwitch']),
        });
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['mouseDown']);
        toolSwitcherServiceSpy.currentService = pencilServiceSpy;
        keypressHandlerServiceSpy = jasmine.createSpyObj('KeypressHandlerService', ['onKeyUp', 'onKeyDown', 'onKeyPress']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['reset', 'loadDrawing', 'setInitialDimensions', 'refreshView']);
        undoRedoServiceSpy.actionsDone = [];
        undoRedoServiceSpy.actionsUndone = [];

        TestBed.configureTestingModule({
            declarations: [EditorComponent, DrawingComponent, SidebarComponent],
            providers: [
                { provide: ToolSwitcherService, useValue: toolSwitcherServiceSpy },
                { provide: KeypressHandlerService, useValue: keypressHandlerServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
            imports: [AppModule],
        })
            .overrideComponent(EditorComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(EditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('onKeyPress()', () => {
        it("should call the tool using toolHandlerService's switchTool when receiving a Keypress event", () => {
            const event = { key: ToolKey.Mouse } as KeyboardEvent;
            component.onKeyPress(event);
            expect(keypressHandlerServiceSpy.onKeyPress).toHaveBeenCalledWith(event);
        });
    });

    describe('onKeyDown()', () => {
        it("should call the keypressHandler's onKeyDown function", () => {
            const event = { key: 'Shift' } as KeyboardEvent;
            component.onKeyDown(event);
            expect(keypressHandlerServiceSpy.onKeyDown).toHaveBeenCalledWith(event);
        });
    });

    describe('onKeyUp()', () => {
        it("should call the keypressHandler's onKeyUp function", () => {
            const event = { key: 'Shift' } as KeyboardEvent;
            component.onKeyUp(event);
            expect(keypressHandlerServiceSpy.onKeyUp).toHaveBeenCalledWith(event);
        });
    });

    describe('drawingContainerWidth', () => {
        it('should return the appropriate value if the drawingContainer is not defined', () => {
            expect(component.drawingContainerWidth).toEqual(component['drawingContainer'].getElementRef().nativeElement.clientWidth);
        });
    });
});
