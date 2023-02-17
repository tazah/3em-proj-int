import { LassoSelectionManager } from '@app/classes/selection/lasso-selection-manager';
import { Vec2 } from '@app/classes/vec2';
import { SelectionType } from '@app/constants/tool.constants';
import { SelectionActionData } from './selection-action-data';

class SelectionActionDataTest extends SelectionActionData {}

// tslint:disable
describe('SelectionActionData', () => {

    beforeEach(() => {
    });

    describe('prepareForPaste', () => {
        it('should reset parameters and inverse selection width and height if < 0', () => {
            // selectionAction.oldSelectionHeight = 0;
            let actionData = new SelectionActionDataTest();
            actionData.newSelectionWidth = -1;
            actionData.newSelectionHeight = -1;
            actionData.newSelectionTopLeftCorner = new Vec2(50, 50);
            const oldTopLeft = actionData.newSelectionTopLeftCorner;
            SelectionActionDataTest.prepareForPaste(actionData);
            expect(actionData.newSelectionTopLeftCorner).toEqual(new Vec2(0 - actionData.newSelectionWidth, 0 - actionData.newSelectionHeight));
            expect(actionData.shouldFillOriginalWhite).toBeFalse();
            expect(actionData.newSelectionTopLeftCorner.x).not.toEqual(oldTopLeft.x);
            expect(actionData.newSelectionTopLeftCorner.y).not.toEqual(oldTopLeft.y);
        });
    });

    describe('prepareForDelete', () => {
        it('should update pathData values', async () => {
            let actionData = new SelectionActionDataTest();
            actionData.oldSelectionTopLeftCorner = new Vec2(300, 200);
            actionData.oldSelectionWidth = 200;
            actionData.oldSelectionHeight = 300;
            actionData.newSelectionTopLeftCorner = new Vec2(100, 150);
            actionData.newSelectionWidth = 200;
            actionData.oldSelectionWidth = 300;
            actionData.type = SelectionType.Lasso;
            actionData.pathData = [new Vec2(0, 0), new Vec2(10, 10), new Vec2(500, 500), new Vec2(450, 500), new Vec2(0, 0)];
            actionData.imageData = { close: () => {} } as ImageBitmap;
            const lassoSpy = spyOn<any>(LassoSelectionManager, 'getMinAndMaxPoint').and.returnValue([new Vec2(50, 50), new Vec2(0, 0)]);
            SelectionActionDataTest.prepareForDelete(actionData);
            expect(lassoSpy).toHaveBeenCalled();
        });
    });
});
