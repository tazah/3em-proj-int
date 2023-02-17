import { Component } from '@angular/core';
import { DEFAULT_SLIDER_STEP, MAX_SLIDER_VALUE, MIN_SLIDER_VALUE } from '@app/constants/style.constants';
import { PencilService } from '@app/services/tools/pencil.service';
@Component({
    selector: 'app-attribute-bar-pencil',
    templateUrl: './attribute-bar-pencil.component.html',
    styleUrls: ['./attribute-bar-pencil.component.scss'],
})
export class AttributeBarPencilComponent {
    readonly sliderStep: number = DEFAULT_SLIDER_STEP;
    readonly minWidthSlider: number = MIN_SLIDER_VALUE;
    readonly maxWidthSlider: number = MAX_SLIDER_VALUE;

    constructor(private pencilService: PencilService) {}

    get lineWidth(): number {
        return this.pencilService.lineWidth;
    }

    set lineWidth(value: number) {
        this.pencilService.lineWidth = value;
    }
}
