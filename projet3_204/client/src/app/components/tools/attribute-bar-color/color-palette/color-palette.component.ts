import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { COLOR_PICKER_DIM } from '@app/constants/color.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { ColorService } from '@app/services/color/color.service';

// Inspired from https://malcoded.com/posts/angular-color-picker/
@Component({
    selector: 'app-color-palette',
    templateUrl: './color-palette.component.html',
    styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, AfterViewChecked {
    @ViewChild('palette', { static: false }) palette: ElementRef<HTMLCanvasElement>;
    paletteCtx: CanvasRenderingContext2D;

    private mouseDown: boolean = false;
    private selectedPosition: Vec2;

    constructor(private colorService: ColorService) {}

    ngAfterViewInit(): void {
        this.paletteCtx = this.palette.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.colorService.paletteCtx = this.paletteCtx;
        this.updatePaletteTone();
    }

    ngAfterViewChecked(): void {
        this.updatePaletteTone();
    }

    private updatePaletteTone(): void {
        this.paletteCtx.fillStyle = this.colorService.tone;
        this.drawColorPalette();
    }

    private drawColorPalette(): void {
        this.paletteCtx.fillRect(0, 0, this.paletteDim, this.paletteDim);

        const whiteGrad = this.paletteCtx.createLinearGradient(0, 0, this.paletteDim, 0);
        whiteGrad.addColorStop(0, 'rgba(255,255,255,1)');
        whiteGrad.addColorStop(1, 'rgba(255,255,255,0)');

        this.paletteCtx.fillStyle = whiteGrad;
        this.paletteCtx.fillRect(0, 0, this.paletteDim, this.paletteDim);

        const blackGrad = this.paletteCtx.createLinearGradient(0, 0, 0, this.paletteDim);
        blackGrad.addColorStop(0, 'rgba(0,0,0,0)');
        blackGrad.addColorStop(1, 'rgba(0,0,0,1)');

        this.paletteCtx.fillStyle = blackGrad;
        this.paletteCtx.fillRect(0, 0, this.paletteDim, this.paletteDim);

        if (this.mouseDown) {
            this.paletteCtx.strokeStyle = 'white';
            this.paletteCtx.fillStyle = 'white';
            this.paletteCtx.beginPath();
            const PALETTE_SELECTOR_RADIUS = 5;
            this.paletteCtx.arc(this.selectedPosition.x, this.selectedPosition.y, PALETTE_SELECTOR_RADIUS, 0, 2 * Math.PI);
            this.paletteCtx.lineWidth = 2;
            this.paletteCtx.stroke();
        }
    }

    onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
        this.colorService.onMouseUp(event);
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = true;
        if (event.button === MouseButton.Right) event.preventDefault();
        this.selectedPosition = new Vec2(event.offsetX, event.offsetY);
        this.colorService.onMouseDown(event);
    }

    onMouseMove(event: MouseEvent): void {
        this.colorService.onMouseMove(event);
        if (!this.mouseDown) return;
        this.selectedPosition = new Vec2(event.offsetX, event.offsetY);
    }

    onMouseOut(): void {
        if (!this.mouseDown) return;
        this.colorService.onMouseUp({
            offsetX: this.selectedPosition.x,
            offsetY: this.selectedPosition.y,
            button: MouseButton.Left,
        } as MouseEvent);
        this.mouseDown = false;
    }

    get paletteDim(): number {
        return COLOR_PICKER_DIM;
    }
}
