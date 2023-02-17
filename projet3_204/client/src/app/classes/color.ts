import { BLACK, DEFAULT_OPACITY, MAX_8_BITS_VALUE, OPACITY_SLIDER_MAX_WIDTH, OPACITY_SLIDER_MIN_WIDTH } from '@app/constants/color.constants';

export class Color {
    hexString: string = BLACK;
    r: number = MAX_8_BITS_VALUE;
    g: number = MAX_8_BITS_VALUE;
    b: number = MAX_8_BITS_VALUE;
    alpha: number = DEFAULT_OPACITY;

    rgbaString: string;

    constructor(hex?: string) {
        if (hex) {
            this.hexString = hex.toUpperCase();
            this.refreshRGB();
            this.refreshRGBAString();
        }
    }

    get red(): number {
        return this.r;
    }

    set red(value: number) {
        if (value >= 0 && value <= MAX_8_BITS_VALUE) {
            this.r = value;
            this.refreshHexString();
            this.refreshRGBAString(DEFAULT_OPACITY);
        }
    }

    get green(): number {
        return this.g;
    }

    set green(value: number) {
        if (value >= 0 && value <= MAX_8_BITS_VALUE) {
            this.g = value;
            this.refreshHexString();
            this.refreshRGBAString(DEFAULT_OPACITY);
        }
    }

    get blue(): number {
        return this.b;
    }

    set blue(value: number) {
        if (value >= 0 && value <= MAX_8_BITS_VALUE) {
            this.b = value;
            this.refreshHexString();
            this.refreshRGBAString(DEFAULT_OPACITY);
        }
    }

    get hex(): string {
        return this.hexString;
    }

    set hex(value: string) {
        if (value.match(/[0-9A-F]{6}$/i)) {
            this.hexString = '#' + value.toUpperCase();
        } else if (value.match(/([0-9A-F]{3})$/i)) {
            // Inspired from https://gomakethings.com/converting-a-color-from-a-three-digit-hexcolor-to-a-six-digit-hexcolor-with-vanilla-js/
            value = value
                .split('')
                .map((h) => {
                    return h + h;
                })
                .join('');
            this.hexString = '#' + value.toUpperCase();
        }
        this.refreshRGB();
        this.refreshRGBAString(DEFAULT_OPACITY);
    }

    get opacity(): number {
        return this.alpha;
    }

    set opacity(value: number) {
        if (value && value < OPACITY_SLIDER_MIN_WIDTH) {
            this.alpha = OPACITY_SLIDER_MIN_WIDTH;
        } else if (value > OPACITY_SLIDER_MAX_WIDTH) {
            this.alpha = OPACITY_SLIDER_MAX_WIDTH;
        } else {
            this.alpha = value;
        }
        this.refreshRGBAString();
    }

    static invert(hex: string): string {
        hex = hex.substring(1, hex.length);
        // Inspired from https://stackoverflow.com/a/35970186
        const redIndex = 2;
        const r = MAX_8_BITS_VALUE - parseInt(hex.slice(0, redIndex), 16);
        const greenIndex = 4;
        const g = MAX_8_BITS_VALUE - parseInt(hex.slice(redIndex, greenIndex), 16);
        const blueIndex = 6;
        const b = MAX_8_BITS_VALUE - parseInt(hex.slice(greenIndex, blueIndex), 16);
        return '#' + Color.nToString(r) + Color.nToString(g) + Color.nToString(b);
    }

    static createFromPosition(ctx: CanvasRenderingContext2D, x: number, y: number): Color {
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        const color: Color = new Color();
        color.r = imageData[0];
        color.g = imageData[1];
        color.b = imageData[2];
        const alphaIndex = 3;
        color.alpha = imageData[alphaIndex];
        color.refreshHexString();
        color.refreshRGBAString();
        return color;
    }

    static RGBAString(r: number, g: number, b: number, a: number): string {
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    static RGBAStringFromPosition(ctx: CanvasRenderingContext2D, x: number, y: number): string {
        const imageData = ctx.getImageData(x, y, 1, 1).data;
        return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }

    static nToString(dec: number): string {
        const str = dec.toString(16).toUpperCase();
        return str.length === 1 ? '0' + str : str;
    }

    private refreshRGB(): void {
        const redIndex = 1;
        this.r = parseInt(this.hexString.substr(redIndex, 2), 16);
        const greenIndex = 3;
        this.g = parseInt(this.hexString.substr(greenIndex, 2), 16);
        const blueIndex = 5;
        this.b = parseInt(this.hexString.substr(blueIndex, 2), 16);
    }

    private refreshHexString(): void {
        this.hexString = '#' + Color.nToString(this.r) + Color.nToString(this.g) + Color.nToString(this.b);
    }

    private refreshRGBAString(a?: number): void {
        this.alpha = a ? a : this.alpha;
        this.rgbaString = Color.RGBAString(this.r, this.g, this.b, this.alpha);
    }
}
