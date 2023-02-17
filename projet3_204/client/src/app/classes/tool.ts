import { Vec2 } from '@app/classes/vec2';
import { CANVAS_NOT_LOCATED_COORDS } from '@app/constants/tool.constants';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Type } from '@common/classes/movement';
import { ToolAction } from './actions/tool-action';
import { ToolActionData } from './actions/tool-action-data';

// Ceci est justifié vu qu'on a des fonctions qui seront gérés par les classes enfant
// tslint:disable:no-empty
export abstract class Tool {
    public typeTool: Type = Type.PENCIL;
    constructor(
        protected drawingService: DrawingService,
        protected colorService: ColorService,
        protected undoRedoService: UndoRedoService,
        protected chatCommunicationService: ChatCommunicationService,
        protected userAuthentificationService: UserAuthentificationService,
    ) {}

    get lineWidth(): number {
        return this.toolActionData.lineWidth;
    }

    set lineWidth(value: number) {
        if (value < 1) return;
        this.toolActionData.lineWidth = value;
    }

    protected toolActionData: ToolActionData;
    isOutsideCanvas: boolean = true;
    started: boolean = false;
    mouseDown: boolean = false;

    private canvasAbsoluteCoords: Vec2;

    draw(drawToBaseCanvas: boolean, actionData: ToolActionData): void {
        this.drawingService.baseCtx.lineWidth = actionData.lineWidth;
        this.drawingService.previewCtx.lineWidth = actionData.lineWidth;
    }

    onMouseDown(event: MouseEvent): void {}

    onMouseUp(event: MouseEvent): void {}

    onMouseMove(event: MouseEvent): void {}

    onMouseOut(event: MouseEvent): void {
        this.isOutsideCanvas = true;
    }

    onMouseOver(event: MouseEvent): void {
        this.isOutsideCanvas = false;
    }

    getPositionFromMouse(event: MouseEvent): Vec2 {
        const htmlElement = event.target as HTMLElement;
        let mousePositionRelativeToCanvas = new Vec2(event.offsetX, event.offsetY);
        const elementIsOutideCanvas = htmlElement.id !== this.drawingService.previewCtx.canvas.id;
        if (elementIsOutideCanvas && this.canvasAbsoluteCoords) {
            let absoluteCoodrsOfElement = this.getAbsoluteElementCoords(htmlElement);
            const elementIsOutisdeOfPage = isNaN(absoluteCoodrsOfElement.x) || isNaN(absoluteCoodrsOfElement.y);
            if (elementIsOutisdeOfPage) {
                mousePositionRelativeToCanvas = new Vec2(0, 0);
                absoluteCoodrsOfElement = new Vec2(event.x, event.y);
            }
            mousePositionRelativeToCanvas.x += absoluteCoodrsOfElement.x - this.canvasAbsoluteCoords.x;
            mousePositionRelativeToCanvas.y += absoluteCoodrsOfElement.y - this.canvasAbsoluteCoords.y;
        } else if (elementIsOutideCanvas && !this.canvasAbsoluteCoords) {
            return CANVAS_NOT_LOCATED_COORDS;
        } else if (!this.canvasAbsoluteCoords) {
            this.canvasAbsoluteCoords = this.getAbsoluteElementCoords(event.target as HTMLElement);
        }
        return mousePositionRelativeToCanvas;
    }

    onKeyDown(event: KeyboardEvent): void {}

    onKeyUp(event: KeyboardEvent): void {}

    onKeyPress(event: KeyboardEvent): void {}

    onClick(event: MouseEvent): void {}

    onDblClick(event: MouseEvent): void {}

    onMouseWheel(event: WheelEvent): void {}

    private getAbsoluteElementCoords(element: HTMLElement): Vec2 {
        let parentOffset = new Vec2(0, 0);
        if (element.offsetParent) {
            parentOffset = this.getAbsoluteElementCoords(element.offsetParent as HTMLElement);
        } else if (element.parentElement && element.localName !== 'body') {
            return this.getAbsoluteElementCoords(element.parentElement);
        }
        return new Vec2(element.offsetLeft + parentOffset.x, element.offsetTop + parentOffset.y);
    }

    onSwitch(toolActionData?: ToolActionData): void {}

    onSwitchOff(): void {}

    protected recordAction(): void {
        this.undoRedoService.addAction(new ToolAction(this, Object.assign({}, this.toolActionData)));
    }

    private calculateLineSlope(point1: Vec2, point2: Vec2): number {
        return (point1.y - point2.y) / (point1.x - point2.x);
    }

    protected pointIsBeyondCanvas(point: Vec2): { width: boolean; height: boolean } {
        return {
            width: point.x >= this.drawingService.canvas.width || point.x <= 0,
            height: point.y >= this.drawingService.canvas.height || point.y <= 0,
        };
    }

    protected calculateIntersectionPoint(outsidePoint: Vec2, insidePoint: Vec2): Vec2 {
        const outsidePointIsBeyondCanvas = this.pointIsBeyondCanvas(outsidePoint);

        const predictedPoint = new Vec2(
            outsidePoint.x >= this.drawingService.canvas.width ? this.drawingService.canvas.width : 0,
            outsidePoint.y >= this.drawingService.canvas.height ? this.drawingService.canvas.height : 0,
        );
        const axesEquations = new Vec2(predictedPoint);

        const pointIsBeyondWidthAndHeight = outsidePointIsBeyondCanvas.width && outsidePointIsBeyondCanvas.height;
        const pointIsFartherFromCanvasHeight = outsidePoint.y - axesEquations.y > outsidePoint.x - axesEquations.x;

        const slope = this.calculateLineSlope(outsidePoint, insidePoint);

        if (outsidePointIsBeyondCanvas.width && !(pointIsBeyondWidthAndHeight && pointIsFartherFromCanvasHeight)) {
            predictedPoint.y = slope * axesEquations.x + insidePoint.y - insidePoint.x * slope;
        }
        if (outsidePointIsBeyondCanvas.height && !(pointIsBeyondWidthAndHeight && !pointIsFartherFromCanvasHeight)) {
            predictedPoint.x = (axesEquations.y - insidePoint.y) / slope + insidePoint.x;
        }
        if (!outsidePointIsBeyondCanvas.width && !outsidePointIsBeyondCanvas.height) {
            predictedPoint.x = insidePoint.x;
            predictedPoint.y = insidePoint.y;
        }

        return predictedPoint;
    }
}
