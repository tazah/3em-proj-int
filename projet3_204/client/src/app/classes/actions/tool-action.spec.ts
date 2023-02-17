import { Tool } from '@app/classes/tool';
import { ToolActionDataTest } from '@app/classes/tool-test';
import { ToolAction } from './tool-action';

// tslint:disable
describe('ToolAction', () => {
    let toolAction: ToolAction;
    let toolSpy: jasmine.SpyObj<Tool>;

    beforeEach(() => {
        toolSpy = jasmine.createSpyObj('Tool', ['draw']);
        toolAction = new ToolAction(toolSpy, new ToolActionDataTest);
    });

    it('execute should call the tool service draw function', () => {
        toolAction.execute();
        expect(toolSpy.draw).toHaveBeenCalledWith(true, toolAction['actionData']);
    });
});
