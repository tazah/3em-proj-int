import { AfterViewChecked, AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Tool } from '@app/classes/tool';
import { WHITE } from '@app/constants/color.constants';
import { BUTTON_POSITION, BUTTON_SIDE_LENGTH, DEFAULT_MARGINS } from '@app/constants/style.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { NewDrawingService } from '@app/services/file-options/new-drawing.service';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { ToolSwitcherService } from '@app/services/tool-switcher/tool-switcher.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

@Component({
    selector: 'app-drawing',
    templateUrl: './drawing.component.html',
    styleUrls: ['./drawing.component.scss'],
})
export class DrawingComponent implements AfterViewInit, AfterViewChecked {
    @ViewChild('baseCanvas', { static: false }) baseCanvas: ElementRef<HTMLCanvasElement>;
    // On utilise ce canvas pour dessiner sans affecter le dessin final
    @ViewChild('previewCanvas', { static: false }) previewCanvas: ElementRef<HTMLCanvasElement>;
    @ViewChild('canvasContainer', { static: false }) canvasContainer: ElementRef<HTMLDivElement>;

    WHITE: typeof WHITE = WHITE;
    DEFAULT_MARGINS: typeof DEFAULT_MARGINS = DEFAULT_MARGINS;
    BUTTON_POSITION: typeof BUTTON_POSITION = BUTTON_POSITION;

    private baseCtx: CanvasRenderingContext2D;
    private previewCtx: CanvasRenderingContext2D;

    constructor(
        private drawingService: DrawingService,
        private toolSwitcherService: ToolSwitcherService,
        private resizingService: ResizingService,
        private newDrawingService: NewDrawingService,
        private undoRedoService: UndoRedoService,
    ) {
        this.undoRedoService.reset();
        //this.undoRedoService.loadDrawing();
        if (this.undoRedoService.savedDrawingLoaded) {
            this.undoRedoService.setInitialDimensions();
        } else {
            this.newDrawingService.initialSize();
        }
    }

    ngAfterViewInit(): void {
        this.baseCtx = this.baseCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.previewCtx = this.previewCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.drawingService.baseCtx = this.baseCtx;
        this.drawingService.previewCtx = this.previewCtx;
        this.drawingService.canvas = this.baseCanvas.nativeElement;

        this.resizingService.baseCtx = this.baseCtx;
        this.resizingService.previewCtx = this.previewCtx;
        this.resizingService.baseCanvas = this.baseCanvas.nativeElement;
        this.resizingService.previewCanvas = this.previewCanvas.nativeElement;

        this.resizingService.canvasContainerParent = (this.canvasContainer.nativeElement.parentElement as HTMLElement).parentElement as HTMLElement;
        setTimeout(() => {
            this.resizingService.hasResized = true;
            this.ngAfterViewChecked();
        });
    }

    ngAfterViewChecked(): void {
        if (!this.resizingService.hasResized) return;
        this.currentService.onSwitch();
        this.resizingService.hasResized = false;
        this.drawingService.setCanvasBackgroundToWhite();
        this.undoRedoService.refreshView();
    }

    @HostListener('document:dragstart', ['$event'])
    onDragStart(event: DragEvent): void {
        event.preventDefault();
    }

    onCanvasMouseOut(event: MouseEvent): void {
        this.currentService.onMouseOut(event);
    }

    onCanvasClick(event: MouseEvent): void {
        this.currentService.onClick(event);
    }

    onCanvasDblClick(event: MouseEvent): void {
        this.currentService.onDblClick(event);
    }

    onCanvasMouseOver(event: MouseEvent): void {
        this.currentService.onMouseOver(event);
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent): void {
        this.currentService.onMouseMove(event);
        this.resizingService.onMouseMove(event);
    }

    onCanvasMouseDown(event: MouseEvent): void {
        this.currentService.onMouseDown(event);
    }

    onResizeMouseDown(event: MouseEvent): void {
        this.resizingService.onMouseDown(event);
    }

    @HostListener('document:mouseup', ['$event'])
    onMouseUp(event: MouseEvent): void {
        this.currentService.onMouseUp(event);
        this.resizingService.onMouseUp(event);
    }

    // Inspired from https://stackoverflow.com/a/56661433
    @HostListener('contextmenu', ['$event'])
    onRightClick(event: MouseEvent): void {
        event.preventDefault();
    }

    @HostListener('wheel', ['$event'])
    @HostListener('mousewheel', ['$event'])
    onMouseWheel(event: WheelEvent): void {
        this.currentService.onMouseWheel(event);
    }

    get canvasWidth(): number {
        return this.resizingService.canvasSize.x;
    }

    get canvasHeight(): number {
        return this.resizingService.canvasSize.y;
    }

    get previewCanvasWidth(): number {
        return this.resizingService.previewCanvasSize.x;
    }

    get previewCanvasHeight(): number {
        return this.resizingService.previewCanvasSize.y;
    }

    get buttonSideLength(): number {
        return BUTTON_SIDE_LENGTH;
    }

    get borderStyle(): string {
        return this.resizingService.borderStyle;
    }

    get isDragging(): boolean {
        return this.resizingService.isDragging;
    }

    get viewResized(): boolean {
        return this.resizingService.hasResized;
    }

    get currentService(): Tool {
        return this.toolSwitcherService.currentService;
    }

    get isUsingTool(): boolean {
        return this.currentService.started;
    }
}
