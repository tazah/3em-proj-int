import { PathPoint } from '@app/constants/tool.constants';
import { ToolActionData } from './tool-action-data';

export class StrokeActionData extends ToolActionData {
    pathData: PathPoint[] = [];
    primaryColor: string;

    constructor(primaryColor: string) {
        super();
        this.primaryColor = primaryColor;
    }
}
