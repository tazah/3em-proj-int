import { Component } from '@angular/core';
import { DEFAULT_ERASER_WIDTH, DEFAULT_SLIDER_STEP, MAX_SLIDER_VALUE } from '@app/constants/style.constants';
import { EraserService } from '@app/services/tools/eraser.service';

@Component({
    selector: 'app-attribute-bar-eraser',
    templateUrl: './attribute-bar-eraser.component.html',
    styleUrls: ['./attribute-bar-eraser.component.scss'],
})
export class AttributeBarEraserComponent {
    readonly sliderStep: number = DEFAULT_SLIDER_STEP;
    readonly minWidthSlider: number = DEFAULT_ERASER_WIDTH;
    readonly maxWidthSlider: number = MAX_SLIDER_VALUE;

    constructor(private eraserService: EraserService) {
        this.eraserService.lineWidth = this.minWidthSlider;
    }

    get lineWidth(): number {
        return this.eraserService.lineWidth;
    }

    set lineWidth(value: number) {
        this.eraserService.lineWidth = value;
    }
}
