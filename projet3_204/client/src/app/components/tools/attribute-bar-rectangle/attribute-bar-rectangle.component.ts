import { Component } from '@angular/core';
import { DEFAULT_SLIDER_STEP, MAX_SLIDER_VALUE, MIN_SLIDER_VALUE} from '@app/constants/style.constants';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { Style } from '@common/classes/movement';

@Component({
    selector: 'app-attribute-bar-rectangle',
    templateUrl: './attribute-bar-rectangle.component.html',
    styleUrls: ['./attribute-bar-rectangle.component.scss'],
})
export class AttributeBarRectangleComponent {
    Style: typeof Style = Style;

    readonly sliderStep: number = DEFAULT_SLIDER_STEP;
    readonly minWidthSlider: number = MIN_SLIDER_VALUE;
    readonly maxWidthSlider: number = MAX_SLIDER_VALUE;

    constructor(private rectangleService: RectangleService) {}

    set shapeStyle(value: Style) {
        this.rectangleService.shapeStyle = value;
    }

    get shapeStyle(): Style {
        return this.rectangleService.shapeStyle;
    }

    set lineWidth(value: number) {
        this.rectangleService.lineWidth = value;
    }

    get lineWidth(): number {
        return this.rectangleService.lineWidth;
    }
}
