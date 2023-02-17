import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { AppModule } from '@app/app.module';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { BUTTON_SIDE_LENGTH } from '@app/constants/style.constants';
import { SelectionButtonPosition } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { SelectionBoxComponent } from './selection-box.component';
// tslint:disable: no-magic-numbers
describe('SelectionBoxComponent', () => {
    let component: SelectionBoxComponent;
    let fixture: ComponentFixture<SelectionBoxComponent>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let drawingStub: DrawingService;
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        drawingStub = new DrawingService();
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['onMouseDown', 'onMouseMove', 'onMouseUp']);
        selectionServiceSpy.buttonPos = [
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
        ];

        TestBed.configureTestingModule({
            declarations: [SelectionBoxComponent],
            providers: [
                { provide: DrawingService, useValue: drawingStub },
                { provide: SelectionService, useValue: selectionServiceSpy },
            ],
            imports: [AppModule, MatIconModule],
        }).compileComponents();
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        drawingStub.selectionBoxCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        fixture = TestBed.createComponent(SelectionBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onMouseMoveSelection should stopPropagation and call onMouseMove', () => {
        const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);
        component.onMouseMoveSelection(event);
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(selectionServiceSpy.onMouseMove).toHaveBeenCalledWith(event);
    });

    it('onMouseDownSelection should stopPropagation and call onMouseDown', () => {
        const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);
        component.onMouseDownSelection(event, true, false);
        component.onMouseDownSelection(event, false, false, SelectionButtonPosition.BottomLeft);
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(selectionServiceSpy.onMouseDown).toHaveBeenCalled();
    });

    it('onMouseUpSelection should stopPropagation and call onMousUp', () => {
        const event = jasmine.createSpyObj('MouseEvent', ['stopPropagation']);
        component.onMouseUpSelection(event);
        expect(event.stopPropagation).toHaveBeenCalled();
        expect(selectionServiceSpy.onMouseUp).toHaveBeenCalledWith(event);
    });

    it('should get button length', () => {
        const value = component.buttonSideLength;
        expect(value).toEqual(BUTTON_SIDE_LENGTH);
    });

    it('should get the position of the button', () => {
        const result: Vec2[] = component.buttons;
        const expected: Vec2[] = [
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
            new Vec2(0, 0),
        ];
        expect(result).toEqual(expected);
    });

    it('should get the top left Corner', () => {
        component.buttons[SelectionButtonPosition.BottomLeft].y = 200;

        component.buttons[SelectionButtonPosition.TopRight].x = 100;
        component.buttons[SelectionButtonPosition.BottomRight].x = 100;
        component.buttons[SelectionButtonPosition.TopLeft].x = 101;
        component.buttons[SelectionButtonPosition.TopLeft].y = 101;
        expect(component.selectionRectangleTopLeftCorner.x).not.toEqual(101);
    });
});
