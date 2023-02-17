import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse.constants';
import { ColorService } from '@app/services/color/color.service';
import { ColorPaletteComponent } from './color-palette.component';

// tslint:disable: no-magic-numbers no-string-literal
describe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;

    let colorStub: jasmine.SpyObj<Color>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let canvasTestHelper: CanvasTestHelper;
    let paletteCtxStub: CanvasRenderingContext2D;
    let mouseEvent: MouseEvent;

    beforeEach(waitForAsync(() => {
        colorStub = jasmine.createSpyObj('ColorStub', ['RGBAStringFromPosition']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['tone', 'onMouseMove', 'onMouseDown', 'onMouseUp']);
        canvasTestHelper = new CanvasTestHelper();

        TestBed.configureTestingModule({
            declarations: [ColorPaletteComponent],
            providers: [
                { provide: ColorService, useValue: colorServiceSpy },
                { provide: Color, useValue: colorStub },
            ],
            imports: [AppModule],
        }).compileComponents();

        paletteCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            x: 30,
            y: 25,
            button: 0,
        } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPaletteComponent);
        component = fixture.componentInstance;
        component.paletteCtx = paletteCtxStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should draw arc pointer on paletteCtx', () => {
        const white = '#ffffff';
        component['mouseDown'] = true;
        component['selectedPosition'] = new Vec2(20, 25);
        component['drawColorPalette']();

        expect(component.paletteCtx.strokeStyle).toEqual(white);
        expect(component.paletteCtx.fillStyle).toEqual(white);
        expect(component.paletteCtx.lineWidth).toEqual(2);
    });

    it('onMouseDown should set mouseDown to true', () => {
        // tslint:disable-next-line: no-empty
        const event = { button: MouseButton.Right, buttons: 1, offsetY: 25, offsetX: 10, preventDefault: () => {} } as MouseEvent;
        component.onMouseDown(event);

        expect(component['mouseDown']).toEqual(true);
        expect(component['selectedPosition'].equals(new Vec2(event.offsetX, event.offsetY))).toBeTrue();
        expect(colorServiceSpy.onMouseDown).toHaveBeenCalled();
    });

    it('onMouseDown should call onMouseDown from colorService', () => {
        // tslint:disable-next-line: no-empty
        const event = { button: MouseButton.Left, buttons: 1, offsetY: 25, offsetX: 10, preventDefault: () => {} } as MouseEvent;
        component.onMouseDown(event);
        expect(colorServiceSpy.onMouseDown).toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown to false', () => {
        component.onMouseUp(mouseEvent);
        expect(component['mouseDown']).toEqual(false);
    });

    it('onMouseMove should verify that mouseDown is equal to true', () => {
        component['mouseDown'] = true;
        component.onMouseMove(mouseEvent);
        expect(colorServiceSpy.onMouseMove).toHaveBeenCalledWith(mouseEvent);
        expect(component['selectedPosition'].x).toEqual(mouseEvent.offsetX);
        expect(component['selectedPosition'].y).toEqual(mouseEvent.offsetY);
    });

    it('onMouseMove should call onMouseMove from colorService', () => {
        component.onMouseMove(mouseEvent);
        expect(colorServiceSpy.onMouseMove).toHaveBeenCalledWith(mouseEvent);
    });

    it('onMouseOut should call onMouseUp from colorService if mouseDown is true', () => {
        component['mouseDown'] = true;
        component['selectedPosition'] = new Vec2(20, 25);
        component.onMouseOut();
        expect(colorServiceSpy.onMouseUp).toHaveBeenCalled();
    });

    it('onMouseOut should set mouseDown to false', () => {
        component['selectedPosition'] = new Vec2(25, 25);
        component.onMouseOut();
        expect(component['mouseDown']).toEqual(false);
    });
});
