import { Tool } from '@app/classes/tool';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { MouseButton } from '@app/constants/mouse.constants';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Movement, Origin, Style } from '@common/classes/movement';
import { Point } from '@common/classes/point';
import { ShapeActionData } from './actions/shape-action-data';
import { Vec2 } from './vec2';

export abstract class ShapeTool extends Tool {
    toolActionData: ShapeActionData = new ShapeActionData(this.colorService.primaryColor.rgbaString, this.colorService.secondaryColor.rgbaString);

    constructor(
        drawingService: DrawingService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
    }

    draw(drawToBaseCanvas: boolean, actionData: ShapeActionData): void {
        super.draw(drawToBaseCanvas, actionData);
        const ctx = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        ctx.fillStyle = actionData.primaryColor;
        ctx.strokeStyle = actionData.secondaryColor;
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = this.started = event.button === MouseButton.Left;
        if (!this.mouseDown) return;
        this.mouseDownPosition = this.getPositionFromMouse(event);
        this.refreshColors();
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.mousePosition = this.getPositionFromMouse(event);

        let movement: Movement = {
            author: this.userAuthentificationService.userProtected.userName as string,
            startPoint: this.mouseDownPosition as Point,
            endPoint: this.mousePosition as Point,
            origin: Origin.WEB,
            originHeight: this.drawingService.canvas.height,
            originWidth: this.drawingService.canvas.width,
            color: this.toolActionData.primaryColor,
            secondaryColor: this.toolActionData.secondaryColor,
            type: this.typeTool,
            borderWidth: this.toolActionData.lineWidth,
            style: this.toolActionData.shapeStyle,
            isSelected: false,
        };
        this.chatCommunicationService.sendMvt(movement);

        this.draw(true, this.toolActionData);
        this.recordAction();
        this.mouseDown = this.started = false;
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;
        this.mousePosition = this.getPositionFromMouse(event);
        this.draw(false, this.toolActionData);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (!(event.key === KeyboardButton.Shift)) return;
        this.shiftDown = true;

        if (!this.mouseDown) return;
        this.draw(false, this.toolActionData);
    }

    onKeyUp(event: KeyboardEvent): void {
        if (!(event.key === KeyboardButton.Shift)) return;
        this.shiftDown = false;

        if (!this.mouseDown) return;
        this.draw(false, this.toolActionData);
    }

    private refreshColors(): void {
        this.toolActionData.primaryColor = this.colorService.primaryColor.rgbaString;
        this.toolActionData.secondaryColor = this.colorService.secondaryColor.rgbaString;
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

    set shapeStyle(value: Style) {
        this.toolActionData.shapeStyle = value;
    }

    get shapeStyle(): Style {
        return this.toolActionData.shapeStyle;
    }
}
