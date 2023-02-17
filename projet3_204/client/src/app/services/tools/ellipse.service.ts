import { Injectable } from '@angular/core';
import { ShapeActionData } from '@app/classes/actions/shape-action-data';
import { ShapeTool } from '@app/classes/shape-tool';
import { Vec2 } from '@app/classes/vec2';
import { BLACK } from '@app/constants/color.constants';
import { LINE_DASH } from '@app/constants/style.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Movement, Style, Type } from '@common/classes/movement';
import { UserAuthentificationService } from '../authentification/UserAuthentification.service';
import { ChatCommunicationService } from '../chat/chat-communication.service';

@Injectable({
    providedIn: 'root',
})
export class EllipseService extends ShapeTool {
    constructor(
        drawingService: DrawingService,
        private rectangleService: RectangleService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
        this.typeTool = Type.ELLIPSE;
        this.chatCommunicationService.socket.on('new update', (movement) => {
            let mvt: Movement;
            if(movement instanceof Object){
                 mvt = movement as Movement
            }
            else{
                 mvt = JSON.parse(movement);
            }

        

            let ratioH = this.drawingService.baseCtx.canvas.height/mvt.originHeight
            let ratioW = this.drawingService.baseCtx.canvas.width/mvt.originWidth

            console.log( "ratioH :" , ratioH)
            console.log( "ratioW :" , ratioW)

            console.log(this.drawingService.baseCtx.canvas)
            console.log("ratio W" , ratioW)
            console.log("ratio H", ratioH)
            mvt.startPoint?.x
            let startPoint = {
                x: ratioW*(mvt.startPoint?.x as number),
                y:ratioH*(mvt.startPoint?.y as number)} as Vec2;
            let endPoint = {
                x: ratioW*(mvt.endPoint?.x as number),
                y:ratioH*(mvt.endPoint?.y as number)} as Vec2;

            console.log("start scaled : ", startPoint)
            console.log("end scaled : ", endPoint)

            if (mvt.type === Type.ELLIPSE) {
                console.log('HEREEEEE : ', mvt.type.toString());
                let actionTest: ShapeActionData = new ShapeActionData(mvt.color,
                    mvt.color);
                actionTest.lineWidth = mvt.borderWidth;
                actionTest.shiftDown = false;
                actionTest.mouseDownPosition = startPoint as Vec2;
                actionTest.mousePosition = endPoint as Vec2;
                actionTest.primaryColor = mvt.color;
                actionTest.secondaryColor = mvt.secondaryColor as string;
                actionTest.lineWidth = mvt.borderWidth;
                actionTest.shapeStyle = mvt.style;
                actionTest.sidesNumber = 0;
                
                console.log("style sent :", mvt.style.toString());
                console.log("style current :", actionTest.shapeStyle.toString());
                actionTest.sidesNumber = 0
                console.log('actionTest', actionTest);
                console.log('mvt', mvt);
                console.log('le');
                this.draw(true, actionTest);
            }
        });
    }

    draw(drawToBaseCanvas: boolean, actionData: ShapeActionData): void {
        super.draw(drawToBaseCanvas, actionData);
        const ctx: CanvasRenderingContext2D = drawToBaseCanvas ? this.drawingService.baseCtx : this.drawingService.previewCtx;
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        let width = actionData.mousePosition.x - actionData.mouseDownPosition.x;
        let height = actionData.mousePosition.y - actionData.mouseDownPosition.y;

        console.log("start scaled : ", width)
        console.log("end scaled : ", height)

        const radiusX = Math.abs(Math.abs(width / 2) - actionData.lineWidth / 2 - 1);
        const radiusY = Math.abs(Math.abs(height / 2) - actionData.lineWidth / 2 - 1);
        const x = actionData.mouseDownPosition.x + width / 2;
        const y = actionData.mouseDownPosition.y + height / 2;

        if (!drawToBaseCanvas) {
            this.drawPerimeter(width, height);
        }

        ctx.beginPath();
        super.draw(drawToBaseCanvas, actionData);
        ctx.ellipse(x, y, radiusX, radiusY, 0, 0, 2 * Math.PI);
        //  this.chatCommunicationService.sendMvt(movement);
        switch (actionData.shapeStyle) {
            case Style.STYLE1:
                ctx.stroke();
                break;
            case Style.STYLE2:
                ctx.fill();
                break;
            case Style.STYLE3:
                ctx.stroke();
                ctx.fill();
                break;
        }
        ctx.closePath();
    }

    private drawPerimeter(width: number, height: number): void {
        const ctx = this.drawingService.previewCtx;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.save();
        ctx.setLineDash(LINE_DASH);
        const rectangleDrawActionData: ShapeActionData = new ShapeActionData(BLACK, BLACK);
        rectangleDrawActionData.mousePosition = new Vec2(this.mouseDownPosition.x + width, this.mouseDownPosition.y + height);
        rectangleDrawActionData.mouseDownPosition = new Vec2(this.mouseDownPosition);
        rectangleDrawActionData.shapeStyle = Style.STYLE1;
        this.rectangleService.draw(false, rectangleDrawActionData);
        ctx.restore();
        ctx.closePath();
    }
}
