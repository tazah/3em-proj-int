import { Injectable } from '@angular/core';
import { Color } from '@app/classes/color';
import { BLACK, MAX_8_BITS_VALUE, N_MAX_COLORS, Picker, WHITE } from '@app/constants/color.constants';
import { MouseButton } from '@app/constants/mouse.constants';

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    primaryColor: Color = new Color(BLACK);
    secondaryColor: Color = new Color(WHITE);
    recentColors: Color[] = [this.primaryColor, this.secondaryColor];

    currentColor: Color = this.primaryColor;
    currentlyChanging: number = Picker.Primary;

    mouseDown: boolean = false;

    paletteCtx: CanvasRenderingContext2D;
    private hue: string = Color.RGBAString(MAX_8_BITS_VALUE, MAX_8_BITS_VALUE, MAX_8_BITS_VALUE, 1);

    swapColors(): void {
        const temp: Color = this.primaryColor;
        this.primaryColor = this.secondaryColor;
        this.secondaryColor = temp;
        this.currentlyChanging = this.currentlyChanging === Picker.Primary ? Picker.Secondary : Picker.Primary;
    }

    swapCurrent(id: Picker): void {
        switch (id) {
            case Picker.Primary:
                this.currentColor = this.primaryColor;
                this.currentlyChanging = Picker.Primary;
                break;

            case Picker.Secondary:
                this.currentColor = this.secondaryColor;
                this.currentlyChanging = Picker.Secondary;
                break;
        }
    }

    setCurrent(color: Color, id: Picker, fromRecentColorsBox?: boolean): void {
        switch (id) {
            case Picker.Primary:
                this.primaryColor = color;
                if (!fromRecentColorsBox) this.currentColor = this.primaryColor;
                break;

            case Picker.Secondary:
                this.secondaryColor = color;
                if (!fromRecentColorsBox) this.currentColor = this.secondaryColor;
                break;
        }
        this.addColor(color);
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;
        this.mouseDown = true;

        if (this.currentColor === this.primaryColor) this.currentlyChanging = Picker.Primary;
        if (this.currentColor === this.secondaryColor) this.currentlyChanging = Picker.Secondary;

        this.currentColor.rgbaString = Color.RGBAStringFromPosition(this.paletteCtx, event.offsetX, event.offsetY);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;

        if (this.currentColor === this.primaryColor) this.currentlyChanging = Picker.Primary;
        if (this.currentColor === this.secondaryColor) this.currentlyChanging = Picker.Secondary;

        this.currentColor.rgbaString = Color.RGBAStringFromPosition(this.paletteCtx, event.offsetX, event.offsetY);
    }

    onMouseUp(event: MouseEvent): void {
        if (event.button !== MouseButton.Left) return;
        if (!this.mouseDown) return;
        this.mouseDown = false;

        this.setCurrent(Color.createFromPosition(this.paletteCtx, event.offsetX, event.offsetY), this.currentlyChanging);
    }

    get tone(): string {
        return this.hue;
    }

    set tone(hue: string) {
        this.hue = hue;
    }

    private addColor(color: Color): void {
        if (this.recentColors.some((recentColor) => recentColor.hex === color.hex)) return;

        if (this.recentColors.length === N_MAX_COLORS) {
            this.recentColors.pop();
        }

        this.recentColors.unshift(color);
    }
}
