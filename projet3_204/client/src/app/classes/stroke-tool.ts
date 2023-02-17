import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { MouseButton } from '@app/constants/mouse.constants';
import { PathPoint } from '@app/constants/tool.constants';
import { UserAuthentificationService } from '@app/services/authentification/UserAuthentification.service';
import { ChatCommunicationService } from '@app/services/chat/chat-communication.service';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Movement, Origin, Style, Type } from '@common/classes/movement';
import { StrokeActionData } from './actions/stroke-action-data';
export abstract class StrokeTool extends Tool {
    constructor(
        drawingService: DrawingService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
        this.chatCommunicationService.socket.on('new update', (movement) => {
            console.log('HELLLO');
           // console.log(movement as Movement);
            
           let mvt: Movement;
           if(movement instanceof Object){
                mvt = movement as Movement
           }
           else{
                mvt = JSON.parse(movement);
           }

            let test: PathPoint[] = [];

            console.log(mvt);

            let ratioH = this.drawingService.baseCtx.canvas.height / mvt.originHeight;
            let ratioW = this.drawingService.baseCtx.canvas.width / mvt.originWidth;

            mvt.path?.forEach((data) => {
                data.x = data.x * ratioW;
                data.y = data.y * ratioH;
                test.push({ point: data as Vec2, shouldMoveTo: false });
            });
            console.log('TYPPPE', mvt.type);

            if (mvt.type === Type.PENCIL) {
                let strokeActionData: StrokeActionData = {
                    pathData: test,
                    primaryColor: mvt.color,
                    lineWidth: mvt.borderWidth,
                };
                this.draw(true, strokeActionData);
            }
        });
    }

    protected toolActionData: StrokeActionData = new StrokeActionData(this.colorService.primaryColor.rgbaString);

    protected lastOutsidePosition: Vec2;
    protected lastInsidePosition: Vec2;

    protected mousePosition: Vec2;

    draw(drawToBaseCanvas: boolean, actionData: StrokeActionData): void {
        super.draw(drawToBaseCanvas, actionData);
        const ctx = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.strokeStyle = actionData.primaryColor;
        ctx.beginPath();
        for (const element of actionData.pathData) {
            if (element.shouldMoveTo) {
                ctx.moveTo(element.point.x, element.point.y);
            } else {
                ctx.lineTo(element.point.x, element.point.y);
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    onMouseDown(event: MouseEvent): void {
        this.mouseDown = this.started = event.button === MouseButton.Left && event.buttons !== 0;
        if (!this.mouseDown) return;
        this.mousePosition = this.getPositionFromMouse(event);
        this.lastInsidePosition = new Vec2(this.mousePosition);
        this.pathData.push({ point: this.mousePosition, shouldMoveTo: false });
        this.isOutsideCanvas = false;
        this.refreshColours();
        this.onMouseMove(event);
    }

    onMouseUp(event: MouseEvent): void {
        if (!this.mouseDown || event.button !== MouseButton.Left) return;
        this.mouseDown = this.started = false;
        if (!this.isOutsideCanvas) {
            this.mousePosition = this.getPositionFromMouse(event);
            this.pathData.push({ point: this.mousePosition, shouldMoveTo: false });
        }
        this.draw(true, this.toolActionData);
        this.recordAction();
        console.log('tableau', this.pathData);
        const pathSent: Vec2[] = [];
        this.pathData.forEach((data) => pathSent.push(data.point));
        console.log('to send', pathSent);

        const mvt: Movement = {
            author: this.userAuthentificationService.userProtected.userName as string,
            isSelected: false,
            origin: Origin.WEB,
            originHeight: this.drawingService.canvas.height,
            originWidth: this.drawingService.canvas.width,
            path: pathSent,
            color: this.toolActionData.primaryColor,
            type: Type.PENCIL,
            borderWidth: this.toolActionData.lineWidth,
            style: Style.STYLE1,
        };
        this.chatCommunicationService.sendMvt(mvt);

        this.pathData = [];
    }

    onMouseOut(event: MouseEvent): void {
        if (!this.mouseDown) return;
        if (event.buttons === 0) {
            this.onMouseUp(event);
            return;
        }
        super.onMouseOut(event);
        this.lastInsidePosition = new Vec2(this.mousePosition);
        this.mousePosition = this.getPositionFromMouse(event);
        this.lastOutsidePosition = new Vec2(this.mousePosition);

        this.pathData.push({ point: this.calculateIntersectionPoint(this.mousePosition, this.lastInsidePosition), shouldMoveTo: false });
        this.draw(false, this.toolActionData);
    }

    onMouseOver(event: MouseEvent): void {
        if (!this.mouseDown) return;
        if (event.buttons === 0) {
            this.onMouseUp(event);
            return;
        }

        super.onMouseOver(event);
        this.lastOutsidePosition = new Vec2(this.mousePosition);
        this.mousePosition = this.getPositionFromMouse(event);
        this.lastInsidePosition = new Vec2(this.mousePosition);
        this.pathData.push({ point: this.calculateIntersectionPoint(this.lastOutsidePosition, this.mousePosition), shouldMoveTo: true });
        this.draw(false, this.toolActionData);
    }

    onMouseMove(event: MouseEvent): void {
        if (!this.mouseDown) return;
        if (event.buttons === 0) {
            this.onMouseUp(event);
            return;
        }
        this.mousePosition = this.getPositionFromMouse(event);
        if (this.isOutsideCanvas) {
            this.lastOutsidePosition = new Vec2(this.mousePosition);
            return;
        }
        this.lastInsidePosition = new Vec2(this.mousePosition);
        this.pathData.push({ point: this.mousePosition, shouldMoveTo: false });
        this.draw(false, this.toolActionData);
    }

    get pathData(): PathPoint[] {
        return this.toolActionData.pathData;
    }

    set pathData(pathData: PathPoint[]) {
        this.toolActionData.pathData = pathData;
    }

    private refreshColours(): void {
        this.toolActionData.primaryColor = this.colorService.primaryColor.rgbaString;
    }
}
