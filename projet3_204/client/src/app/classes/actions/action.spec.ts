import { Action } from './action';

class ActionTest extends Action {}

// tslint:disable
describe('Action', () => {
    let action: ActionTest;

    beforeEach(() => {
        action = new ActionTest();
    });

    describe('executeAll', () => {
        it('should call all execute methods', () => {
            const executeSpy = spyOn(action, 'execute').and.callThrough();
            const executeResizeActionSpy = spyOn(action, 'executeResizeAction').and.callThrough();
            action.executeAll();
            expect(executeSpy).toHaveBeenCalled();
            expect(executeResizeActionSpy).toHaveBeenCalled();
        });
    });

    describe('execute', () => {
        it('should call execute on linkedAction if its defined', () => {
            action['linkedAction'] = new ActionTest();
            const executeSpy = spyOn<any>(action['linkedAction'], 'execute').and.callThrough();
            action.execute();
            expect(action['linkedAction']).toBeDefined();
            expect(executeSpy).toHaveBeenCalled();
        });
    });

    describe('executeResizeAction', () => {
        it('should call execute on linkedAction if its defined', () => {
            action['linkedAction'] = new ActionTest();
            const executeSpy = spyOn<any>(action['linkedAction'], 'execute').and.callThrough();
            action.executeResizeAction();
            expect(action['linkedAction']).toBeDefined();
            expect(executeSpy).toHaveBeenCalled();
        });
    });

    describe('pushLinkedAction', () => {
        it('should call itselft back if linkedAction is defined', () => {
            action['linkedAction'] = new ActionTest();
            const pushLinkedActionSpy = spyOn<any>(action['linkedAction'], 'pushLinkedAction').and.callThrough();
            action.pushLinkedAction(new ActionTest());
            expect(action['linkedAction']).toBeDefined();
            expect(pushLinkedActionSpy).toHaveBeenCalled();
        });
    });
});
