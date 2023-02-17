import { Vec2 } from '@app/classes/vec2';
import { WHITE } from '@app/constants/color.constants';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { Action } from './action';

export class ResizeAction extends Action {
    private oldDimensions: Vec2;
    private newDimensions: Vec2;
    private baseCtx: CanvasRenderingContext2D;

    constructor(newDimensions: Vec2, oldDimensions: Vec2, private resizingService: ResizingService, baseCtx: CanvasRenderingContext2D) {
        super();
        this.newDimensions = new Vec2(newDimensions);
        this.oldDimensions = new Vec2(oldDimensions);
        this.baseCtx = baseCtx;
    }

    executeResizeAction(): void {
        this.resizingService.setSize(this.newDimensions);
        super.executeResizeAction();
    }

    execute(): void {
        this.baseCtx.fillStyle = WHITE;
        if (this.newDimensions.x > this.oldDimensions.x) {
            this.baseCtx.fillRect(this.oldDimensions.x, 0, this.newDimensions.x - this.oldDimensions.x, this.newDimensions.y);
        }
        if (this.newDimensions.y > this.oldDimensions.y) {
            this.baseCtx.fillRect(0, this.oldDimensions.y, this.newDimensions.x, this.newDimensions.y - this.oldDimensions.y);
        }
        super.execute();
    }
}
