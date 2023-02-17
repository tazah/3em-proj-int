import { Vec2 } from '@app/classes/vec2';
import { LineTypeJonctions, PathPoint } from '@app/constants/tool.constants';
import { ToolActionData } from './tool-action-data';

export class LineActionData extends ToolActionData {
    pathData: PathPoint[] = [];
    primaryColor: string;
    shiftDown: boolean = false;
    typeJonctions: LineTypeJonctions = LineTypeJonctions.Normale;
    pointDiameter: number = 1;
    mouseDownPosition: Vec2;
    mousePosition: Vec2;

    constructor(primaryColor: string) {
        super();
        this.primaryColor = primaryColor;
    }
}
