import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Color } from '@app/classes/color';
import { COLOR_PICKER_DIM, COLOR_SLIDER_WIDTH, SLIDER_GRADIENT_STOP } from '@app/constants/color.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { ColorService } from '@app/services/color/color.service';

// Inspired from https://malcoded.com/posts/angular-color-picker/
@Component({
    selector: 'app-color-slider',
    templateUrl: './color-slider.component.html',
    styleUrls: ['./color-slider.component.scss'],
})
export class ColorSliderComponent implements AfterViewInit {
    @ViewChild('slider') slider: ElementRef<HTMLCanvasElement>;
    sliderCtx: CanvasRenderingContext2D;

    private mouseDown: boolean = false;
    private selectedHeight: number;

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        this.sliderCtx = this.slider.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawSlider();
    }

    private drawSlider(): void {
        this.sliderCtx.clearRect(0, 0, this.sliderWidth, this.sliderHeight);

        const gradient = this.sliderCtx.createLinearGradient(0, 0, 0, this.sliderHeight);
        gradient.addColorStop(SLIDER_GRADIENT_STOP[0], 'rgba(255, 0, 0, 1)');
        gradient.addColorStop(SLIDER_GRADIENT_STOP[1], 'rgba(255, 255, 0, 1)');
        gradient.addColorStop(SLIDER_GRADIENT_STOP[2], 'rgba(0, 255, 0, 1)');
        // Next magic numbers are disable because they represent indexes of a constant list used for the gradient stop
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(SLIDER_GRADIENT_STOP[3], 'rgba(0, 255, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(SLIDER_GRADIENT_STOP[4], 'rgba(0, 0, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(SLIDER_GRADIENT_STOP[5], 'rgba(255, 0, 255, 1)');
        // tslint:disable-next-line: no-magic-numbers
        gradient.addColorStop(SLIDER_GRADIENT_STOP[6], 'rgba(255, 0, 0, 1)');

        this.sliderCtx.beginPath();
        this.sliderCtx.rect(0, 0, this.sliderWidth, this.sliderHeight);

        this.sliderCtx.fillStyle = gradient;
        this.sliderCtx.fill();
        this.sliderCtx.closePath();

        if (this.selectedHeight) {
            this.sliderCtx.beginPath();
            this.sliderCtx.strokeStyle = 'white';
            this.sliderCtx.lineWidth = 2;
            const SLIDER_SELECTOR_HEIGHT = 8;
            this.sliderCtx.rect(0, this.selectedHeight - 2, this.sliderWidth, SLIDER_SELECTOR_HEIGHT);
            this.sliderCtx.stroke();
            this.sliderCtx.closePath();
        }
    }

    onMouseDown(event: MouseEvent): void {
        if (event.button === MouseButton.Right) event.preventDefault();
        this.mouseDown = true;
        this.selectedHeight = event.offsetY;
        this.drawSlider();
        this.colorService.tone = Color.RGBAStringFromPosition(this.sliderCtx, event.offsetX, event.offsetY);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.selectedHeight = event.offsetY;
        this.drawSlider();
        this.colorService.tone = Color.RGBAStringFromPosition(this.sliderCtx, event.offsetX, event.offsetY);
    }

    @HostListener('document:mouseup')
    onMouseUp(): void {
        if (!this.mouseDown) return;
        this.mouseDown = false;
    }

    get sliderWidth(): number {
        return COLOR_SLIDER_WIDTH;
    }

    get sliderHeight(): number {
        return COLOR_PICKER_DIM;
    }
}
