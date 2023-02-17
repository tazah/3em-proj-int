import { TestBed } from '@angular/core/testing';
import { Color } from '@app/classes/color';
import { OPACITY_SLIDER_MAX_WIDTH, OPACITY_SLIDER_MIN_WIDTH } from '@app/constants/color.constants';

//tslint:disable
describe('Color', () => {
    let color: Color;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        color = new Color();
    });

    it('should create an object', () => {
        expect(color).toBeTruthy();
    });

    it('should set the value of red attribute', () => {
        let value = 0x40;
        color.red = value;
        expect(color.r).toEqual(value);

        value = -0.1;
        color.red = value;
        expect(color.r).not.toEqual(value);

        value = 3400;
        color.red = value;
        expect(color.r).not.toEqual(value);
    });

    it('should set the value of green attribute', () => {
        let value = 0xff;
        color.green = value;
        expect(color.g).toEqual(value);

        value = -90;
        color.green = value;
        expect(color.g).not.toEqual(value);

        value = 0xfff;
        color.green = value;
        expect(color.g).not.toEqual(value);
    });

    it('should set the value of blue attribute', () => {
        let value = 0x1c;
        color.blue = value;
        expect(color.b).toEqual(value);

        value = -1;
        color.blue = value;
        expect(color.b).not.toEqual(value);

        value = 256;
        color.blue = value;
        expect(color.b).not.toEqual(value);
    });

    it('should set the opacity to the value given in parameter', () => {
        let opacity = 0.45;
        color.opacity = opacity;
        expect(color.alpha).toEqual(opacity);

        opacity = -100;
        color.opacity = opacity;
        expect(color.alpha).toEqual(OPACITY_SLIDER_MIN_WIDTH);

        opacity = 1.0001;
        color.opacity = opacity;
        expect(color.alpha).toEqual(OPACITY_SLIDER_MAX_WIDTH);
    });

    it('should set hex string attribute', () => {
        let value = 'ff0ff1';
        let expected = '#FF0FF1';
        color.hex = value;
        expect(color.hex).toEqual(expected);

        value = 'fff';
        expected = '#FFFFFF';
        color.hex = value;
        expect(color.hex).toEqual(expected);

        const oldHex = color.hex;
        value = 'rgba(255,255,255,1)';
        color.hex = value;
        expect(color.hex).toEqual(oldHex);
    });

    it('invert function should invert the hex string passed in parameter', () => {
        const hex = '#FFFFFF';
        const result = Color.invert(hex);
        const expected = '#000000';
        expect(result).not.toEqual(hex);
        expect(result).toEqual(expected);
    });
});
