import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { MouseButton } from '@app/constants/mouse.constants';
import { ColorSliderComponent } from './color-slider.component';

// tslint:disable: no-string-literal
describe('ColorSliderComponent', () => {
    let component: ColorSliderComponent;
    let fixture: ComponentFixture<ColorSliderComponent>;

    let canvasTestHelper: CanvasTestHelper;
    let sliderCtxStub: CanvasRenderingContext2D;
    let mouseEvent: MouseEvent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ColorSliderComponent],
            imports: [AppModule],
        }).compileComponents();

        canvasTestHelper = new CanvasTestHelper();
        sliderCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        mouseEvent = {
            offsetX: 25,
            offsetY: 25,
            x: 30,
            y: 25,
            button: 0,
        } as MouseEvent;
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorSliderComponent);
        component = fixture.componentInstance;
        component.sliderCtx = sliderCtxStub;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('onMouseDown should set mouseDown to true', () => {
        // tslint:disable-next-line: no-empty
        const value = { button: MouseButton.Left, buttons: 1, offsetY: 25, offsetX: 10, preventDefault: () => {} } as MouseEvent;
        component.onMouseDown(value);
        expect(component['mouseDown']).toEqual(true);
        expect(component['selectedHeight']).toEqual(value.offsetY);
    });

    it('onMouseDown should set mouseDown to true even when called with right mouse button', () => {
        // tslint:disable-next-line: no-empty
        const value = { button: MouseButton.Right, buttons: 1, offsetY: 25, offsetX: 10, preventDefault: () => {} } as MouseEvent;
        component.onMouseDown(value);
        expect(component['mouseDown']).toEqual(true);
        expect(component['selectedHeight']).toEqual(value.offsetY);
    });

    it('onMouseUp should set mouseDown to false if it was true', () => {
        component['mouseDown'] = true;
        component.onMouseUp();
        expect(component['mouseDown']).toEqual(false);
    });

    it('onMouseUp should return if mouseDown was false', () => {
        component['mouseDown'] = false;
        component.onMouseUp();
        expect(component['mouseDown']).toEqual(false);
    });

    it('onMouseMove should call drawSlider function if mouseDown is equal to true', () => {
        // tslint:disable-next-line: no-any
        const drawSliderSpy = spyOn<any>(component, 'drawSlider').and.callThrough();
        component['mouseDown'] = true;
        component.onMouseMove(mouseEvent);
        expect(drawSliderSpy).toHaveBeenCalled();
    });

    it('onMouseMove should not call drawSlider if mouseDown is equal to false', () => {
        // tslint:disable-next-line: no-any
        const drawSliderSpy = spyOn<any>(component, 'drawSlider').and.callThrough();
        component['mouseDown'] = false;
        component.onMouseMove(mouseEvent);
        expect(drawSliderSpy).not.toHaveBeenCalled();
    });
});
