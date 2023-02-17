import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { Color } from '@app/classes/color';
import { Picker } from '@app/constants/color.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { ColorService } from '@app/services/color/color.service';
import { KeypressHandlerService } from '@app/services/keypress-handler/keypress-handler.service';
import { AttributeBarColorComponent } from './attribute-bar-color.component';

describe('AttributeBarColorComponent', () => {
    let component: AttributeBarColorComponent;
    let fixture: ComponentFixture<AttributeBarColorComponent>;

    let service: ColorService;
    let keypressHandlerServiceSpy: jasmine.SpyObj<KeypressHandlerService>;

    beforeEach(waitForAsync(() => {
        keypressHandlerServiceSpy = jasmine.createSpyObj('KeypressHandlerService', ['onEditTextFocus', 'onEditTextFocusOut']);

        TestBed.configureTestingModule({
            declarations: [AttributeBarColorComponent],
            imports: [AppModule],
            providers: [{ provide: KeypressHandlerService, useValue: keypressHandlerServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeBarColorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        service = TestBed.inject(ColorService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('set red should refresh current color red index', () => {
        service.currentColor = service.primaryColor;
        service.currentlyChanging = Picker.Primary;
        service.currentColor.hex = 'FFFFFF';
        const expected = '#22FFFF';
        const value = '0x22';
        // tslint:disable-next-line: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');

        component.red = value;

        expect(service.currentColor.r).toEqual(parseInt(value, 16));
        expect(service.primaryColor.hex).toEqual(expected);
        expect(setCurrentSpy).toHaveBeenCalled();
    });

    it('set green should refresh current color green index', () => {
        service.currentColor = service.primaryColor;
        service.currentlyChanging = Picker.Primary;
        service.currentColor.hex = 'c8FF0F';
        const value = '0x02';
        const expected = '#C8020F';
        // tslint:disable-next-line: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');

        component.green = value;

        expect(service.currentColor.g).toEqual(parseInt(value, 16));
        expect(service.primaryColor.hex).toEqual(expected);
        expect(setCurrentSpy).toHaveBeenCalled();
    });

    it('set blue should refresh current color green blue', () => {
        service.currentColor = service.primaryColor;
        service.currentlyChanging = Picker.Primary;
        service.currentColor.hex = '001aff';
        const value = '0';
        const expected = '#001A00';
        // tslint:disable-next-line: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');

        component.blue = value;

        expect(service.currentColor.b).toEqual(parseInt(value, 16));
        expect(service.primaryColor.hex).toEqual(expected);
        expect(setCurrentSpy).toHaveBeenCalled();
    });

    it('set hex should refresh current color hexString', () => {
        service.currentColor = service.secondaryColor;
        service.currentlyChanging = Picker.Secondary;
        const value = '000';
        const expected = '#000000';
        // tslint:disable-next-line: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');

        component.hex = value;

        expect(service.currentColor.hex).toEqual(expected);
        expect(service.secondaryColor.hex).toEqual(expected);
        expect(setCurrentSpy).toHaveBeenCalled();
    });

    it('should update opacity from currentColor in ColorService', () => {
        const value = 0.366;
        component.opacity = value;
        expect(service.currentColor.opacity).toEqual(value);
    });

    it('should return primaryColor hexadecimal code', () => {
        const value = '123456';
        service.primaryColor.hex = value;
        expect(component.primaryColor).toEqual('#' + value);
    });

    it('should return secondaryColor hexadecimal code', () => {
        const value = 'f00';
        const expected = '#FF0000';
        service.secondaryColor.hex = value;
        expect(component.secondaryColor).toEqual(expected);
    });

    it('onRecentColorsClick on right click should preventDefault', () => {
        // tslint:disable-next-line: no-empty
        const event = { button: MouseButton.Right, preventDefault: () => {} } as MouseEvent;
        const hex = '#ffffff';
        // tslint:disable: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');

        component.onRecentColorsClick(event, hex, Picker.Primary);

        expect(setCurrentSpy).toHaveBeenCalledWith(new Color(hex), Picker.Primary, true);
    });

    it('onRecentColorsClick on left click should preventDefault', () => {
        // tslint:disable-next-line: no-empty
        const event = { button: MouseButton.Left, preventDefault: () => {} } as MouseEvent;
        const hex = '#ffffff';
        // tslint:disable: no-any
        const setCurrentSpy = spyOn<any>(service, 'setCurrent');

        component.onRecentColorsClick(event, hex, Picker.Secondary);

        expect(setCurrentSpy).toHaveBeenCalledWith(new Color(hex), Picker.Secondary, true);
    });

    it('swapColors should call swapColors from ColorService', () => {
        // tslint:disable-next-line: no-any
        const swapColorsSpy = spyOn<any>(service, 'swapColors');
        component.swapColors();
        expect(swapColorsSpy).toHaveBeenCalled();
    });

    it('swapCurrent should call preventDefault if called with right click', () => {
        // tslint:disable-next-line: no-empty
        const event = { button: MouseButton.Right, preventDefault: () => {} } as MouseEvent;
        // tslint:disable-next-line: no-any
        const swapCurrentSpy = spyOn<any>(service, 'swapCurrent');
        component.swapCurrent(event, Picker.Primary);
        expect(swapCurrentSpy).toHaveBeenCalledWith(Picker.Primary);
    });

    it('swapCurrent should only call swapCurrent from ColorService', () => {
        // tslint:disable-next-line: no-empty
        const event = { button: MouseButton.Left } as MouseEvent;
        // tslint:disable-next-line: no-any
        const swapCurrentSpy = spyOn<any>(service, 'swapCurrent');
        component.swapCurrent(event, Picker.Secondary);
        expect(swapCurrentSpy).toHaveBeenCalledWith(Picker.Secondary);
    });

    it('should call onEditTextFocus from keypressHandlerService', () => {
        component.onEditTextFocus();
        expect(keypressHandlerServiceSpy.onEditTextFocus).toHaveBeenCalled();
    });

    it('should call onEditTextFocusOut from keypressHandlerService', () => {
        component.onEditTextFocusOut();
        expect(keypressHandlerServiceSpy.onEditTextFocusOut).toHaveBeenCalled();
    });
});
