import { Injectable } from '@angular/core';
import { ShapeActionData } from '@app/classes/actions/shape-action-data';
import { ShapeTool } from '@app/classes/shape-tool';
import { Vec2 } from '@app/classes/vec2';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Movement, Style, Type } from '@common/classes/movement';
import { UserAuthentificationService } from '../authentification/UserAuthentification.service';
import { ChatCommunicationService } from '../chat/chat-communication.service';

@Injectable({
    providedIn: 'root',
})
export class RectangleService extends ShapeTool {
    constructor(
        drawingService: DrawingService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
        this.typeTool = Type.RECTANGLE;
        this.chatCommunicationService.socket.on('new update', (movement) => {
            console.log((movement as Movement).toString())

            let mvt: Movement;
            if(movement instanceof Object){
                 mvt = movement
            }
            else{
                 mvt = JSON.parse(movement);
            }
            
            console.log(mvt)
            console.log("style non json", (movement as Movement).style)
            let ratioH = this.drawingService.baseCtx.canvas.height/mvt.originHeight
            let ratioW = this.drawingService.baseCtx.canvas.width/mvt.originWidth
            mvt.startPoint?.x
            let startPoint = {
                x: ratioW*(mvt.startPoint?.x as number),
                y: ratioH*(mvt.startPoint?.y as number)} as Vec2;
            let endPoint = {
                x: ratioW*(mvt.endPoint?.x as number),
                y:ratioH*(mvt.endPoint?.y as number)} as Vec2;


                
            console.log( "ratioH :" , ratioH)
            console.log( "ratioW :" , ratioW)
                
            console.log("start scaled : ", startPoint)
            console.log("end scaled : ", endPoint)

            if (mvt.type === Type.RECTANGLE) {
                console.log('HEREEEEE RECTANGLE');
                console.log(mvt.style)
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
                this.draw(true, actionTest);
            }
        });
    }

    draw(drawToBaseCanvas: boolean, actionData: ShapeActionData): void {
        super.draw(drawToBaseCanvas, actionData);
        let ctx: CanvasRenderingContext2D;
        if (drawToBaseCanvas) {
            ctx = this.drawingService.baseCtx;
        } else {
            ctx = this.drawingService.previewCtx;
        }
        this.drawingService.clearCanvas(this.drawingService.previewCtx);
        ctx.lineJoin = 'miter';

        let width = actionData.mousePosition.x - actionData.mouseDownPosition.x;
        let height = actionData.mousePosition.y - actionData.mouseDownPosition.y;

        if (actionData.shiftDown) {
            width = height = Math.min(Math.abs(width), Math.abs(height));
            width = actionData.mousePosition.x < actionData.mouseDownPosition.x ? -width : width;
            height = actionData.mousePosition.y < actionData.mouseDownPosition.y ? -height : height;
        }

        switch (actionData.shapeStyle) {
            case Style.STYLE1:
                ctx.strokeRect(actionData.mouseDownPosition.x, actionData.mouseDownPosition.y, width, height);
                break;
            case Style.STYLE2:
                ctx.fillRect(actionData.mouseDownPosition.x, actionData.mouseDownPosition.y, width, height);
                break;
            case Style.STYLE3:
                ctx.strokeRect(actionData.mouseDownPosition.x, actionData.mouseDownPosition.y, width, height);
                ctx.fillRect(actionData.mouseDownPosition.x, actionData.mouseDownPosition.y, width, height);
                break;
        }
    }
}
