import { Component } from '@angular/core';
import { DEFAULT_POINT_DIAMETER, DEFAULT_SLIDER_STEP, MAX_POINT_DIAMETER, MAX_SLIDER_VALUE, MIN_SLIDER_VALUE } from '@app/constants/style.constants';
import { LineTypeJonctions } from '@app/constants/tool.constants';
import { LineService } from '@app/services/tools/line.service';

@Component({
    selector: 'app-attribute-bar-line',
    templateUrl: './attribute-bar-line.component.html',
    styleUrls: ['./attribute-bar-line.component.scss'],
})
export class AttributeBarLineComponent {
    readonly sliderStep: number = DEFAULT_SLIDER_STEP;
    readonly minWidthSlider: number = MIN_SLIDER_VALUE;
    readonly maxWidthSlider: number = MAX_SLIDER_VALUE;

    readonly minPointDiameter: number = DEFAULT_POINT_DIAMETER;
    readonly maxPointDiameter: number = MAX_POINT_DIAMETER;

    LineTypeJonctions: typeof LineTypeJonctions = LineTypeJonctions;

    constructor(private lineService: LineService) {}

    get lineWidth(): number {
        return this.lineService.lineWidth;
    }

    set lineWidth(value: number) {
        this.lineService.lineWidth = value;
    }

    get pointDiameter(): number {
        return this.lineService.pointDiameter;
    }

    set pointDiameter(value: number) {
        this.lineService.pointDiameter = value;
    }

    get typeJonction(): LineTypeJonctions {
        return this.lineService.typeJonction;
    }

    set typeJonction(value: LineTypeJonctions) {
        this.lineService.typeJonction = value;
    }
}
