import { LassoSelectionManager } from '@app/classes/selection/lasso-selection-manager';
import { Vec2 } from '@app/classes/vec2';
import { SelectionType } from '@app/constants/tool.constants';
import { ToolActionData } from './tool-action-data';

export class SelectionActionData extends ToolActionData {
    oldSelectionTopLeftCorner: Vec2;
    oldSelectionWidth: number;
    oldSelectionHeight: number;
    newSelectionTopLeftCorner: Vec2;
    newSelectionWidth: number;
    newSelectionHeight: number;
    type: SelectionType = SelectionType.Rectangle;
    imageData: ImageBitmap;
    widthScale: number = 1;
    heightScale: number = 1;
    pathData: Vec2[] = [];
    shouldFillOriginalWhite: boolean = true;

    static prepareForPaste(actionData: SelectionActionData): void {
        actionData.newSelectionTopLeftCorner = new Vec2(0, 0);
        actionData.shouldFillOriginalWhite = false;
        if (actionData.newSelectionWidth < 0) actionData.newSelectionTopLeftCorner.x -= actionData.newSelectionWidth;
        if (actionData.newSelectionHeight < 0) actionData.newSelectionTopLeftCorner.y -= actionData.newSelectionHeight;
    }

    static prepareForDelete(actionData: SelectionActionData): void {
        actionData.imageData.close();
        const distanceFromOriginalPosition = new Vec2(
            actionData.newSelectionTopLeftCorner.x - actionData.oldSelectionTopLeftCorner.x,
            actionData.newSelectionTopLeftCorner.y - actionData.oldSelectionTopLeftCorner.y,
        );
        const xScale = actionData.newSelectionWidth / actionData.oldSelectionWidth;
        const yScale = actionData.newSelectionHeight / actionData.oldSelectionHeight;
        actionData.oldSelectionHeight = actionData.newSelectionHeight;
        actionData.oldSelectionWidth = actionData.newSelectionWidth;
        actionData.shouldFillOriginalWhite = true;
        actionData.oldSelectionTopLeftCorner = new Vec2(actionData.newSelectionTopLeftCorner);
        actionData.widthScale = actionData.heightScale = 1;
        const minNode = LassoSelectionManager.getMinAndMaxPoint(actionData.pathData)[0];
        const newPathDataArray: Vec2[] = [];
        for (const point of actionData.pathData) {
            newPathDataArray.push(
                new Vec2(
                    minNode.x + (point.x - minNode.x) * xScale + distanceFromOriginalPosition.x,
                    minNode.y + (point.y - minNode.y) * yScale + distanceFromOriginalPosition.y,
                ),
            );
        }
        actionData.pathData = newPathDataArray;
    }
}
