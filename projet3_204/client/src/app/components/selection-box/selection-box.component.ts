import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { BUTTON_SIDE_LENGTH } from '@app/constants/style.constants';
import { SelectionButtonPosition, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';

@Component({
    selector: 'app-selection-box',
    templateUrl: './selection-box.component.html',
    styleUrls: ['./selection-box.component.scss'],
})
export class SelectionBoxComponent implements AfterViewInit {
    @ViewChild('selectionBoxCanvas', { static: false }) selectionBoxCanvas: ElementRef<HTMLCanvasElement>;

    @Input() canvasHeight: number;
    @Input() canvasWidth: number;

    SelectionButtonPosition: typeof SelectionButtonPosition = SelectionButtonPosition;

    constructor(private selectionService: SelectionService, private drawingService: DrawingService) {}

    ngAfterViewInit(): void {
        this.drawingService.selectionBoxCtx = this.selectionBoxCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    }

    onMouseDownSelection(event: MouseEvent, isOverSelection: boolean, isOverButton: boolean, button?: SelectionButtonPosition): void {
        event.stopPropagation();
        this.selectionService.onMouseDown(event, isOverSelection, isOverButton, button);
    }

    onMouseMoveSelection(event: MouseEvent): void {
        event.stopPropagation();
        this.selectionService.onMouseMove(event);
    }

    onMouseUpSelection(event: MouseEvent): void {
        event.stopPropagation();
        this.selectionService.onMouseUp(event);
    }

    get isInSelection(): boolean {
        return (
            this.selectionService.selectionState !== SelectionState.Nothing &&
            this.selectionService.selectionState !== SelectionState.DrawingSelectionBox
        );
    }

    get buttons(): Vec2[] {
        return this.selectionService.buttonPos;
    }

    get buttonSideLength(): number {
        return BUTTON_SIDE_LENGTH;
    }

    get selectionRectangleTopLeftCorner(): Vec2 {
        let topLeftCorner: Vec2 = this.buttons[SelectionButtonPosition.TopLeft];
        if (this.buttons[SelectionButtonPosition.TopRight].x < topLeftCorner.x || this.buttons[SelectionButtonPosition.TopRight].y < topLeftCorner.y)
            topLeftCorner = this.buttons[SelectionButtonPosition.TopRight];
        if (
            this.buttons[SelectionButtonPosition.BottomLeft].x < topLeftCorner.x ||
            this.buttons[SelectionButtonPosition.BottomLeft].y < topLeftCorner.y
        )
            topLeftCorner = this.buttons[SelectionButtonPosition.BottomLeft];
        if (
            this.buttons[SelectionButtonPosition.BottomRight].x < topLeftCorner.x ||
            this.buttons[SelectionButtonPosition.BottomRight].y < topLeftCorner.y
        )
            topLeftCorner = this.buttons[SelectionButtonPosition.BottomRight];
        return topLeftCorner;
    }

    get selectionBoxDims(): Vec2 {
        return new Vec2(
            Math.abs(this.buttons[SelectionButtonPosition.TopRight].x - this.buttons[SelectionButtonPosition.TopLeft].x),
            Math.abs(this.buttons[SelectionButtonPosition.BottomLeft].y - this.buttons[SelectionButtonPosition.TopLeft].y),
        );
    }
}
