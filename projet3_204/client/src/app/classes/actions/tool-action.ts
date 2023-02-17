import { Tool } from '@app/classes/tool';
import { Action } from './action';
import { ToolActionData } from './tool-action-data';

export class ToolAction extends Action {
    public actionData: ToolActionData;

    constructor(private toolService: Tool, actionData: ToolActionData) {
        super();
        this.actionData = actionData;
    }

    execute(): void {
        this.toolService.draw(true, this.actionData);

        super.execute();
    }
}
