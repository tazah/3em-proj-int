import { Injectable } from '@angular/core';
import { LineActionData } from '@app/classes/actions/line-action-data';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { LineTypeJonctions, PathPoint } from '@app/constants/tool.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { UserAuthentificationService } from '../authentification/UserAuthentification.service';
import { ChatCommunicationService } from '../chat/chat-communication.service';

@Injectable({
    providedIn: 'root',
})
export class LineService extends Tool {
    constructor(
        drawingService: DrawingService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
    }

    set typeJonction(value: LineTypeJonctions) {
        this.toolActionData.typeJonctions = value;
        this.updateView();
    }

    get typeJonction(): LineTypeJonctions {
        return this.toolActionData.typeJonctions;
    }

    set pointDiameter(value: number) {
        this.toolActionData.pointDiameter = value;
        this.updateView();
    }

    get pointDiameter(): number {
        return this.toolActionData.pointDiameter;
    }

    get shiftDown(): boolean {
        return this.toolActionData.shiftDown;
    }

    set shiftDown(value: boolean) {
        this.toolActionData.shiftDown = value;
    }

    get mousePosition(): Vec2 {
        return this.toolActionData.mousePosition;
    }

    set mousePosition(value: Vec2) {
        this.toolActionData.mousePosition = new Vec2(value);
    }

    get mouseDownPosition(): Vec2 {
        return this.toolActionData.mouseDownPosition;
    }

    set mouseDownPosition(value: Vec2) {
        this.toolActionData.mouseDownPosition = new Vec2(value);
    }

    get pathData(): PathPoint[] {
        return this.toolActionData.pathData;
    }

    set pathData(pathData: PathPoint[]) {
        this.toolActionData.pathData = pathData;
    }
    toolActionData: LineActionData = new LineActionData(this.colorService.primaryColor.rgbaString);
    private lastPoint: Vec2;

    // Inspired from https://stackoverflow.com/a/39673693
    static calculateAngleWithXAxis(pointA: Vec2, pointB: Vec2): number {
        const x1 = pointA.x - pointB.x;
        const y1 = pointA.y - pointB.y;

        const angleCercle = 360;

        let angleDeg = Math.atan2(y1, x1) - Math.atan2(0, 1);
        angleDeg = (angleDeg * angleCercle) / (2 * Math.PI);

        if (angleDeg < 0) {
            angleDeg += angleCercle;
        }

        const angleIntervals = 45;
        return Math.round(angleDeg / angleIntervals) * angleIntervals;
    }

    static calculatePointWithAngle(pointA: Vec2, pointB: Vec2): Vec2 {
        const calculatedPoint = new Vec2(pointA);
        const angle = LineService.calculateAngleWithXAxis(pointA, pointB);

        const angleDroit = 90;

        if (angle % (2 * angleDroit) === 0) {
            calculatedPoint.y = pointB.y;
        } else if (angle % angleDroit === 0) {
            calculatedPoint.x = pointB.x;
        } else {
            calculatedPoint.y = Math.tan(angle * (Math.PI / (2 * angleDroit))) * (calculatedPoint.x - pointB.x) + pointB.y;
        }
        return calculatedPoint;
    }

    onClick(event: MouseEvent): void {
        this.started = true;
        this.refreshColours();
        this.mousePosition = this.getPositionFromMouse(event);
        if (this.pathData.length === 0) {
            this.mouseDownPosition = new Vec2(this.mousePosition);
        }
        this.updateView();
        this.pathData.push({ point: this.mousePosition, shouldMoveTo: false });
        this.lastPoint = new Vec2(this.mousePosition);
        this.draw(false, this.toolActionData);
    }

    onDblClick(event: MouseEvent): void {
        if (!this.started) return;
        this.mousePosition = this.getPositionFromMouse(event);
        const distanceDuPointInitial = 20;
        const clickProcheDuPointInitial =
            Math.abs(this.mousePosition.x - this.mouseDownPosition.x) <= distanceDuPointInitial &&
            Math.abs(this.mousePosition.y - this.mouseDownPosition.y) <= distanceDuPointInitial;
        this.pathData.pop();
        this.pathData.pop();
        if (clickProcheDuPointInitial) {
            this.mousePosition = new Vec2(this.mouseDownPosition);
        }
        this.pathData.push({ point: this.mousePosition, shouldMoveTo: false });
        this.draw(true, this.toolActionData);
        this.recordAction();
        this.started = false;
        this.shiftDown = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.started) return;
        this.mousePosition = this.getPositionFromMouse(event);
        this.updateView();
    }

    private updateView(): void {
        if (!this.started) return;
        if (this.isOutsideCanvas) {
            this.mousePosition = this.calculateIntersectionPoint(this.mousePosition, this.lastPoint);
        }
        if (this.shiftDown) {
            this.mousePosition = LineService.calculatePointWithAngle(this.mousePosition, this.lastPoint);
        }
        this.draw(false, this.toolActionData, this.mousePosition);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!this.started) return;

        switch (event.key) {
            case KeyboardButton.Shift:
                this.shiftDown = true;
                this.updateView();
                break;
        }
    }

    onKeyUp(event: KeyboardEvent): void {
        switch (event.key) {
            case KeyboardButton.Shift:
                this.shiftDown = false;
                this.updateView();
                break;

            case KeyboardButton.Escape:
                this.drawingService.clearCanvas(this.drawingService.previewCtx);
                this.pathData = [];
                this.started = false;
                break;

            case KeyboardButton.Backspace:
                if (this.pathData.length > 1) this.pathData.pop();
                this.updateView();
                break;
        }
    }

    draw(drawToBaseCanvas: boolean, actionData: LineActionData, lastPoint?: Vec2): void {
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        const ctx = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = actionData.primaryColor;
        ctx.lineWidth = actionData.lineWidth;
        ctx.beginPath();
        for (const { point } of actionData.pathData) {
            ctx.lineTo(point.x, point.y);
        }
        if (lastPoint) {
            ctx.lineTo(lastPoint.x, lastPoint.y);
        }
        ctx.stroke();
        ctx.closePath();
        if (actionData.typeJonctions === LineTypeJonctions.AvecPoints) {
            ctx.lineWidth = actionData.pointDiameter;
            for (const { point } of actionData.pathData) {
                ctx.beginPath();
                ctx.moveTo(point.x, point.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
                ctx.closePath();
            }
        }
        if (drawToBaseCanvas) {
            this.pathData = [];
        }
    }

    private refreshColours(): void {
        this.toolActionData.primaryColor = this.colorService.primaryColor.rgbaString;
    }
}
