import { Component } from '@angular/core';
import { DEFAULT_SLIDER_STEP, MAX_SLIDER_VALUE, MIN_SLIDER_VALUE} from '@app/constants/style.constants';
import { Style }  from '@common/classes/movement';
import { EllipseService } from '@app/services/tools/ellipse.service';

@Component({
    selector: 'app-attribute-bar-ellipse',
    templateUrl: './attribute-bar-ellipse.component.html',
    styleUrls: ['./attribute-bar-ellipse.component.scss'],
})
export class AttributeBarEllipseComponent {
    Style: typeof Style = Style;

    readonly sliderStep: number = DEFAULT_SLIDER_STEP;
    readonly minWidthSlider: number = MIN_SLIDER_VALUE;
    readonly maxWidthSlider: number = MAX_SLIDER_VALUE;

    constructor(private ellipseService: EllipseService) {}

    set shapeStyle(value: Style) {
        this.ellipseService.shapeStyle = value;
    }

    get shapeStyle(): Style {
        return this.ellipseService.shapeStyle;
    }

    set lineWidth(value: number) {
        this.ellipseService.lineWidth = value;
    }

    get lineWidth(): number {
        return this.ellipseService.lineWidth;
    }
}
