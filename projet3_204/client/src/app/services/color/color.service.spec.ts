import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Color } from '@app/classes/color';
import { BLACK, N_MAX_COLORS, Picker } from '@app/constants/color.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { ColorService } from './color.service';

// tslint:disable: no-string-literal
describe('ColorService', () => {
    let service: ColorService;
    let canvasTestHelper: CanvasTestHelper;
    let paletteCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        TestBed.configureTestingModule({});

        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        paletteCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;

        service = TestBed.inject(ColorService);
        service.paletteCtx = paletteCtxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('swapColors should swap primary and secondary color', () => {
        const primaryValue = service.primaryColor.hexString;
        const secondaryValue = service.secondaryColor.hexString;
        service.currentlyChanging = Picker.Primary;

        service.swapColors();

        expect(service.secondaryColor.hexString).toEqual(primaryValue);
        expect(service.primaryColor.hexString).toEqual(secondaryValue);
        expect(service.currentlyChanging).toEqual(Picker.Secondary);
    });

    it('should swap currentlyChanging from secondary to primary picker', () => {
        service.currentlyChanging = Picker.Secondary;
        service.swapColors();
        expect(service.currentlyChanging).toEqual(Picker.Primary);
    });

    it('swapCurrent should swap current picker to the secondary picker', () => {
        const secondary = Picker.Secondary;
        service.swapCurrent(secondary);

        expect(service.currentColor).toEqual(service.secondaryColor);
        expect(service.currentlyChanging).toEqual(Picker.Secondary);
    });

    it('swapCurrent should swap current picker to the primary picker', () => {
        const primary = Picker.Primary;
        service.swapCurrent(primary);

        expect(service.currentColor).toEqual(service.primaryColor);
        expect(service.currentlyChanging).toEqual(Picker.Primary);
    });

    it('setCurrent should set current color picker to the one passed in parameter if called w/o fromRecentColors', () => {
        const hex = '#FF0000';
        const color = new Color(hex);
        const calledFromRecentsColors = true;

        service.setCurrent(color, Picker.Primary, calledFromRecentsColors);

        expect(service.primaryColor.hexString).toEqual(hex);
        expect(service.currentColor).not.toEqual(service.primaryColor);
    });

    it('setCurrent should not set current color picker to the one passed in parameter if called w/ fromRecentColors', () => {
        const hex = '#00FF00';
        const color = new Color(hex);
        const calledFromRecentsColors = true;

        service.setCurrent(color, Picker.Secondary, calledFromRecentsColors);

        expect(service.secondaryColor.hexString).toEqual(hex);
        expect(service.currentColor).not.toEqual(service.secondaryColor);
    });

    it('setCurrent called from recent colors box and primary picker should not set currentColor', () => {
        const color = new Color(BLACK);
        const oldCurrentValue = service.currentColor;
        service.setCurrent(color, Picker.Primary);
        expect(service.currentColor).toEqual(oldCurrentValue);
    });

    it('setCurrent called from recent colors box and secondary picker should not set currentColor', () => {
        const color = new Color(BLACK);
        const oldCurrentValue = service.currentColor;
        service.setCurrent(color, Picker.Secondary);
        expect(service.currentColor).toEqual(oldCurrentValue);
    });

    it('onMouseDown called with right click should return', () => {
        const event = { button: MouseButton.Right } as MouseEvent;
        service.onMouseDown(event);
        expect(service.mouseDown).not.toEqual(true);
    });

    it('onMouseDown called with left click should set currentColor rgba string', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        const white = 'rgba(0,0,0,1)';
        service.currentColor = service.primaryColor;

        service.onMouseDown(event);

        expect(service.mouseDown).toEqual(true);
        expect(service.currentlyChanging).toEqual(Picker.Primary);
        expect(service.currentColor.rgbaString).toEqual(white);
    });

    it('onMouseDown when currentColor is secondaryColor should set currentlyChanging to Picker.Secondary', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        service.currentColor = service.secondaryColor;
        service.onMouseDown(event);
        expect(service.currentlyChanging).toEqual(Picker.Secondary);
    });

    it('onMouseMove should return if mouseDown is false', () => {
        const event = {} as MouseEvent;
        service.mouseDown = false;
        service.onMouseMove(event);

        // tslint:disable-next-line: no-any
        const rgbaStringPosSpy = spyOn<any>(Color, 'RGBAStringFromPosition');
        expect(rgbaStringPosSpy).not.toHaveBeenCalled();
    });

    it('onMouseMove should set currentColor rgba', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        const white = 'rgba(0,0,0,1)';
        service.mouseDown = true;
        service.currentColor = service.primaryColor;

        service.onMouseMove(event);

        expect(service.currentlyChanging).toEqual(Picker.Primary);
        expect(service.currentColor.rgbaString).toEqual(white);
    });

    it('onMouseMove called while currentColor is secondary should set picker to secondary', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        service.mouseDown = true;
        service.currentColor = service.secondaryColor;

        service.onMouseMove(event);
        expect(service.currentlyChanging).toEqual(Picker.Secondary);
    });

    it('onMouseUp should return if called with right click', () => {
        const event = { button: MouseButton.Right } as MouseEvent;
        // tslint:disable-next-line: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');
        service.onMouseUp(event);
        expect(setCurrentSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should return if mouseDown is false on call', () => {
        const event = { button: MouseButton.Left } as MouseEvent;
        service.mouseDown = false;
        // tslint:disable-next-line: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');
        service.onMouseUp(event);
        expect(setCurrentSpy).not.toHaveBeenCalled();
    });

    it('onMouseUp should set mouseDown to false and call setCurrent', () => {
        const event = { offsetX: 10, offsetY: 10, button: MouseButton.Left } as MouseEvent;
        service.mouseDown = true;
        // tslint:disable-next-line: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');

        service.onMouseUp(event);

        expect(service.mouseDown).not.toEqual(true);
        expect(setCurrentSpy).toHaveBeenCalledWith(Color.createFromPosition(paletteCtxStub, event.offsetX, event.offsetY), service.currentlyChanging);
    });

    it('set tone should set hue attribute to given parameter', () => {
        const value = 'rgba(255,0,1,1)';
        service.tone = value;
        expect(service['hue']).toEqual(value);
    });

    it('should pop color from recentColors if table has reached maximum length', () => {
        // tslint:disable: no-any
        (service as any).addColor(new Color('#F00000'));
        (service as any).addColor(new Color('#FF0000'));
        (service as any).addColor(new Color('#F0F000'));
        (service as any).addColor(new Color('#FFFF00'));
        (service as any).addColor(new Color('#F000F0'));

        (service as any).addColor(new Color('#100000'));
        (service as any).addColor(new Color('#F02300'));
        (service as any).addColor(new Color('#F0D000'));
        (service as any).addColor(new Color('#F55000'));
        (service as any).addColor(new Color('#F00E30'));
        (service as any).addColor(new Color('#F04E30'));
        (service as any).addColor(new Color('#F04E30'));

        expect(service.recentColors.length).toEqual(N_MAX_COLORS);
    });
});
