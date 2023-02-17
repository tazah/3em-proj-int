import { Component } from '@angular/core';
import { Color } from '@app/classes/color';
import {
    OPACITY_SLIDER_MAX_WIDTH,
    OPACITY_SLIDER_MIN_WIDTH,
    OPACITY_SLIDER_STEP,
    Picker,
    RECENTS_COLOR_BOX_DIM,
} from '@app/constants/color.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { DEFAULT_TOOLTIP_DELAY, DEFAULT_TOOLTIP_POSITION } from '@app/constants/style.constants';
import { ColorService } from '@app/services/color/color.service';
import { KeypressHandlerService } from '@app/services/keypress-handler/keypress-handler.service';

@Component({
    selector: 'app-attribute-bar-color',
    templateUrl: './attribute-bar-color.component.html',
    styleUrls: ['./attribute-bar-color.component.scss'],
})
export class AttributeBarColorComponent {
    DEFAULT_TOOLTIP_POSITION: typeof DEFAULT_TOOLTIP_POSITION = DEFAULT_TOOLTIP_POSITION;
    DEFAULT_TOOLTIP_DELAY: typeof DEFAULT_TOOLTIP_DELAY = DEFAULT_TOOLTIP_DELAY;
    OPACITY_SLIDER_MIN_WIDTH: typeof OPACITY_SLIDER_MIN_WIDTH = OPACITY_SLIDER_MIN_WIDTH;
    OPACITY_SLIDER_MAX_WIDTH: typeof OPACITY_SLIDER_MAX_WIDTH = OPACITY_SLIDER_MAX_WIDTH;
    OPACITY_SLIDER_STEP: typeof OPACITY_SLIDER_STEP = OPACITY_SLIDER_STEP;
    RECENTS_COLOR_BOX_DIM: typeof RECENTS_COLOR_BOX_DIM = RECENTS_COLOR_BOX_DIM;

    Picker: typeof Picker = Picker;

    constructor(private colorService: ColorService, private keypressHandlerService: KeypressHandlerService) {}

    get red(): string {
        return this.colorService.currentColor.red.toString(16).toUpperCase();
    }

    set red(value: string) {
        this.colorService.currentColor.red = parseInt(value, 16);
        this.colorService.setCurrent(new Color(this.colorService.currentColor.hexString), this.currentlyChanging);
    }

    get green(): string {
        return this.colorService.currentColor.green.toString(16).toUpperCase();
    }

    set green(value: string) {
        this.colorService.currentColor.green = parseInt(value, 16);
        this.colorService.setCurrent(new Color(this.colorService.currentColor.hexString), this.currentlyChanging);
    }

    get blue(): string {
        return this.colorService.currentColor.blue.toString(16).toUpperCase();
    }

    set blue(value: string) {
        this.colorService.currentColor.blue = parseInt(value, 16);
        this.colorService.setCurrent(new Color(this.colorService.currentColor.hexString), this.currentlyChanging);
    }

    get hex(): string {
        return this.colorService.currentColor.hex.substr(1, this.colorService.currentColor.hex.length);
    }

    set hex(value: string) {
        this.colorService.currentColor.hex = value;
        this.colorService.setCurrent(new Color(this.colorService.currentColor.hexString), this.currentlyChanging);
    }

    get opacity(): number {
        return this.colorService.currentColor.opacity;
    }

    set opacity(value: number) {
        this.colorService.currentColor.opacity = value;
    }

    get colorPreview(): string {
        return this.colorService.currentColor.rgbaString;
    }

    get primaryColor(): string {
        return this.colorService.primaryColor.hexString;
    }

    get secondaryColor(): string {
        return this.colorService.secondaryColor.hexString;
    }

    get recentColors(): Color[] {
        return this.colorService.recentColors;
    }

    get currentlyChanging(): Picker {
        return this.colorService.currentlyChanging;
    }

    onRecentColorsClick(event: MouseEvent, hex: string, id: Picker): void {
        if (event.button === MouseButton.Right) event.preventDefault();
        this.colorService.setCurrent(new Color(hex), id, true);
        this.swapCurrent(event, id);
    }

    swapColors(): void {
        this.colorService.swapColors();
    }

    swapCurrent(event: MouseEvent, id: Picker): void {
        if (event.button === MouseButton.Right) event.preventDefault();
        this.colorService.swapCurrent(id);
    }

    onEditTextFocus(): void {
        this.keypressHandlerService.onEditTextFocus();
    }

    onEditTextFocusOut(): void {
        this.keypressHandlerService.onEditTextFocusOut();
    }
}
