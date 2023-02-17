import { ToolActionData } from './tool-action-data';

export class FillActionData extends ToolActionData {
    primaryColor: string;
    colorLayer: ImageData;

    constructor(primaryColor: string) {
        super();
        this.primaryColor = primaryColor;
    }
}
