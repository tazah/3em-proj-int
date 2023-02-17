import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@app/constants/style.constants';
import { ResizingService } from '@app/services/resizing/resizing.service';
import { ResizeAction } from './resize-action';

// tslint:disable
describe('ResizeAction', () => {
    let resizeAction: ResizeAction;
    let resizingServiceSpy: jasmine.SpyObj<ResizingService>;
    let canvasTestHelper: CanvasTestHelper;
    let fillRectSpy: jasmine.Spy<any>;

    beforeEach(() => {
        resizingServiceSpy = jasmine.createSpyObj('ResizingService', ['setSize']);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        const baseCtx = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D

        resizeAction = new ResizeAction(
            new Vec2(500, 500),
            new Vec2(DEFAULT_WIDTH, DEFAULT_HEIGHT),
            resizingServiceSpy,
            baseCtx);

        fillRectSpy = spyOn(baseCtx, 'fillRect');
    });

    it('executeResizeAction should change the canvas dimensions', () => {
        resizeAction.executeResizeAction();
        expect(resizingServiceSpy.setSize).toHaveBeenCalledWith(resizeAction['newDimensions']);
    });

    it('execute should draw on canvas if new width is bigger', () => {
        resizeAction['newDimensions'] = new Vec2(1500, 500);
        resizeAction.execute();
        expect(fillRectSpy).toHaveBeenCalled();
    });

    it('execute should draw on canvas if new height is bigger', () => {
        resizeAction['newDimensions'] = new Vec2(500, 1500);
        resizeAction.execute();
        expect(fillRectSpy).toHaveBeenCalled();
    });
});
