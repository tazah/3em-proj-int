import { Injectable } from '@angular/core';
import { StrokeActionData } from '@app/classes/actions/stroke-action-data';
import { StrokeTool } from '@app/classes/stroke-tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { UserAuthentificationService } from '../authentification/UserAuthentification.service';
import { ChatCommunicationService } from '../chat/chat-communication.service';

@Injectable({
    providedIn: 'root',
})
export class EraserService extends StrokeTool {
    constructor(
        drawingService: DrawingService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
    }

    onMouseUp(event: MouseEvent): void {
        super.onMouseUp(event);
        this.drawCursor();
    }

    onMouseMove(event: MouseEvent): void {
        this.mousePosition = this.getPositionFromMouse(event);
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        this.drawCursor();
        if (!this.mouseDown) return;
        if (event.buttons === 0) {
            this.onMouseUp(event);
            return;
        }
        if (this.isOutsideCanvas) {
            this.lastOutsidePosition = new Vec2(this.mousePosition);
        } else {
            this.lastInsidePosition = new Vec2(this.mousePosition);
        }
        this.pathData.push({ point: this.mousePosition, shouldMoveTo: false });
        this.draw(false, this.toolActionData);

        this.drawCursor();
    }

    private drawCursor(): void {
        this.drawingService.previewCtx.fillStyle = 'WHITE';
        this.drawingService.previewCtx.strokeStyle = 'BLACK';
        this.drawingService.previewCtx.lineWidth = 1;

        this.drawingService.previewCtx.beginPath();
        this.drawingService.previewCtx.rect(
            this.mousePosition.x - this.lineWidth / 2,
            this.mousePosition.y - this.lineWidth / 2,
            this.lineWidth,
            this.lineWidth,
        );
        this.drawingService.previewCtx.fill();
        this.drawingService.previewCtx.stroke();
        this.drawingService.previewCtx.closePath();

        this.lineWidth = this.lineWidth;
    }

    draw(drawToBaseCanvas: boolean, actionData: StrokeActionData): void {
        const ctx = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        ctx.strokeStyle = 'WHITE';
        ctx.fillStyle = 'WHITE';

        ctx.lineWidth = 1;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);

        for (let i = 0; i < actionData.pathData.length; i++) {
            const point = actionData.pathData[i].point;
            ctx.fillRect(point.x - actionData.lineWidth / 2, point.y - actionData.lineWidth / 2, actionData.lineWidth, actionData.lineWidth);
            if (i === 0) continue;
            if (actionData.pathData[i].shouldMoveTo) {
                ctx.moveTo(point.x, point.y);
                continue;
            }
            const previousPoint = actionData.pathData[i - 1].point;
            ctx.beginPath();
            ctx.lineTo(point.x - actionData.lineWidth / 2, point.y + actionData.lineWidth / 2);
            ctx.lineTo(point.x + actionData.lineWidth / 2, point.y - actionData.lineWidth / 2);
            ctx.lineTo(previousPoint.x + actionData.lineWidth / 2, previousPoint.y - actionData.lineWidth / 2);
            ctx.lineTo(previousPoint.x - actionData.lineWidth / 2, previousPoint.y + actionData.lineWidth / 2);
            ctx.fill();
            ctx.closePath();

            ctx.beginPath();
            ctx.lineTo(point.x - actionData.lineWidth / 2, point.y - actionData.lineWidth / 2);
            ctx.lineTo(point.x + actionData.lineWidth / 2, point.y + actionData.lineWidth / 2);
            ctx.lineTo(previousPoint.x + actionData.lineWidth / 2, previousPoint.y + actionData.lineWidth / 2);
            ctx.lineTo(previousPoint.x - actionData.lineWidth / 2, previousPoint.y - actionData.lineWidth / 2);
            ctx.fill();
            ctx.closePath();
        }

        if (drawToBaseCanvas) {
            this.pathData = [];
        }
    }
}
