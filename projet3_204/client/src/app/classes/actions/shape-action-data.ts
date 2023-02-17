import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_SIDES_NUMBER} from '@app/constants/style.constants';
import { Style } from '@common/classes/movement';
import { ToolActionData } from './tool-action-data';

export class ShapeActionData extends ToolActionData {
    shapeStyle: Style = Style.STYLE2;
    primaryColor: string;
    secondaryColor: string;
    mouseDownPosition: Vec2;
    mousePosition: Vec2;
    shiftDown: boolean;
    sidesNumber: number = DEFAULT_SIDES_NUMBER;

    constructor(primaryColor: string, secondaryColor: string) {
        super();
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
    }
}
