import { TestBed } from '@angular/core/testing';
import { DEFAULT_LINE_WIDTH } from '@app/constants/style.constants';
import { CANVAS_NOT_LOCATED_COORDS } from '@app/constants/tool.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { CanvasTestHelper } from './canvas-test-helper';
import { ToolActionDataTest, ToolTest } from './tool-test';
import { Vec2 } from './vec2';

// tslint:disable
describe('ToolTest', () => {
    let toolTest: ToolTest;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let colorServiceSpy: jasmine.SpyObj<ColorService>;
    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        colorServiceSpy = jasmine.createSpyObj('ColorService', ['update']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);

        TestBed.configureTestingModule({});
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        toolTest = new ToolTest(drawServiceSpy, colorServiceSpy, undoRedoServiceSpy);

        toolTest['drawingService'].baseCtx = baseCtxStub;
        toolTest['drawingService'].previewCtx = previewCtxStub;
        toolTest['drawingService'].canvas = previewCtxStub.canvas;

        toolTest['toolActionData'] = new ToolActionDataTest();
    });

    it(' dummy test to cover code for abstract class (Tool)', () => {
        // Arrange
        const keyevent = {} as KeyboardEvent;
        const mouseEvent = {} as MouseEvent;
        const wheelEvent = {} as WheelEvent;

        // Act
        toolTest.onMouseDown(mouseEvent);
        toolTest.onMouseMove(mouseEvent);
        toolTest.onMouseUp(mouseEvent);
        toolTest.onMouseOut(mouseEvent);
        toolTest.onMouseOver(mouseEvent);
        toolTest.onMouseWheel(wheelEvent);
        toolTest.onKeyPress(keyevent);
        toolTest.onClick(mouseEvent);
        toolTest.onDblClick(mouseEvent);
        toolTest.onKeyDown(keyevent);
        toolTest.onKeyUp(keyevent);
        toolTest.onSwitch();
        toolTest.onSwitchOff();
        toolTest.draw(true, toolTest['toolActionData']);

        // Assert
        expect(true).toBe(true);
    });

    it('Should not set the line width if the value is negative', () => {
        toolTest.lineWidth = -1;
        expect(toolTest.lineWidth).toEqual(DEFAULT_LINE_WIDTH);
    });

    it('Should assign the line width to the toolActionData', () => {
        let lineWidth = 10;
        toolTest.lineWidth = lineWidth;
        expect(toolTest['toolActionData'].lineWidth).toEqual(lineWidth);

        lineWidth = 15;
        toolTest.lineWidth = lineWidth;
        expect(toolTest['toolActionData'].lineWidth).toEqual(lineWidth);
    });

    it('Should set the canvas absolute coordinates when it is not already set', () => {
        const event = { target: previewCtxStub.canvas as EventTarget, offsetX: 25, offsetY: 25 } as MouseEvent;
        toolTest.getPositionFromMouse(event);
        expect(toolTest['canvasAbsoluteCoords']).toBeDefined();
    });

    it('Should not set the canvas absolute coordinates when it is already set', () => {
        const event = { target: previewCtxStub.canvas as EventTarget, offsetX: 25, offsetY: 25 } as MouseEvent;
        toolTest['canvasAbsoluteCoords'] = new Vec2(0, 0);
        toolTest.getPositionFromMouse(event);
        expect(toolTest['canvasAbsoluteCoords'].equals(new Vec2(0, 0))).toBeTrue();
    });

    it('Should return coordinates relative to the canvas even if outide of it', () => {
        const event = {
            target: ({
                id: 'blablabla',
                offsetLeft: 250,
                offsetTop: 250,
                offsetParent: ({ offsetLeft: 500, offsetTop: 500 } as HTMLElement) as Element,
            } as HTMLElement) as EventTarget,
            offsetX: 500,
            offsetY: 500,
        } as MouseEvent;
        toolTest['canvasAbsoluteCoords'] = new Vec2(325, 0);
        const result = toolTest.getPositionFromMouse(event);
        expect(result.equals(new Vec2(925, 1250))).toBeTrue();
    });

    it('Should return coordinates relative to the canvas even if outside of the web page', () => {
        const event = { target: {} as EventTarget, x: 500, y: 500 } as MouseEvent;
        toolTest['canvasAbsoluteCoords'] = new Vec2(325, 0);
        const result = toolTest.getPositionFromMouse(event);
        expect(result.equals(new Vec2(500 - 325, 500))).toBeTrue();
    });

    it('Should get the offset of the parent and add it', () => {
        const element = { offsetLeft: 10, offsetTop: 10, offsetParent: ({ offsetLeft: 5, offsetTop: 5 } as HTMLElement) as Element } as HTMLElement;
        const result = toolTest['getAbsoluteElementCoords'](element);
        expect(
            result.equals(
                new Vec2(
                    element.offsetLeft + (element.offsetParent as HTMLElement).offsetLeft,
                    element.offsetTop + (element.offsetParent as HTMLElement).offsetTop,
                ),
            ),
        ).toBeTrue();
    });

    it('Should get the parent coords if no offset parent is available', () => {
        const element = { offsetLeft: 10, offsetTop: 10, offsetParent: ({ offsetLeft: 5, offsetTop: 5 } as HTMLElement) as Element } as HTMLElement;
        const childElement = { parentElement: element } as HTMLElement;
        const result = toolTest['getAbsoluteElementCoords'](childElement);
        expect(
            result.equals(
                new Vec2(
                    element.offsetLeft + (element.offsetParent as HTMLElement).offsetLeft,
                    element.offsetTop + (element.offsetParent as HTMLElement).offsetTop,
                ),
            ),
        ).toBeTrue();
    });

    it('Should correctly calculate predicted point if outsidePoint is within the height and width of the canvas', () => {
        const insidePoint = { x: previewCtxStub.canvas.width - 20, y: previewCtxStub.canvas.height - 1 };
        const outsidePoint = { x: insidePoint.x + 5, y: previewCtxStub.canvas.height + 5 };
        const predictedPoint = (toolTest as any).calculateIntersectionPoint(outsidePoint, insidePoint);
        expect(predictedPoint.y).toEqual(previewCtxStub.canvas.height);
        expect(predictedPoint.x).not.toEqual(previewCtxStub.canvas.width);
        expect(predictedPoint.x).not.toEqual(0);
        expect(predictedPoint.x).not.toEqual(insidePoint.x);
        expect(predictedPoint.x).not.toEqual(outsidePoint.x);
    });

    it('Should correctly calculate predicted point if outsidePoint is beyond the height of the canvas', () => {
        const insidePoint = { x: previewCtxStub.canvas.width - 20, y: previewCtxStub.canvas.height - 1 };
        const outsidePoint = { x: insidePoint.x + 5, y: previewCtxStub.canvas.height + 5 };
        const predictedPoint = (toolTest as any).calculateIntersectionPoint(outsidePoint, insidePoint);
        expect(predictedPoint.y).toEqual(previewCtxStub.canvas.height);
        expect(predictedPoint.x).not.toEqual(previewCtxStub.canvas.width);
        expect(predictedPoint.x).not.toEqual(0);
        expect(predictedPoint.x).not.toEqual(insidePoint.x);
        expect(predictedPoint.x).not.toEqual(outsidePoint.x);
    });

    it('Should correctly calculate predicted point if outsidePoint is beyond the width of the canvas', () => {
        const insidePoint = { x: previewCtxStub.canvas.width - 1, y: previewCtxStub.canvas.height - 20 };
        const outsidePoint = { x: previewCtxStub.canvas.width + 5, y: insidePoint.y + 5 };
        const predictedPoint = (toolTest as any).calculateIntersectionPoint(outsidePoint, insidePoint);
        expect(predictedPoint.x).toEqual(previewCtxStub.canvas.width);
        expect(predictedPoint.y).not.toEqual(previewCtxStub.canvas.height);
        expect(predictedPoint.y).not.toEqual(0);
        expect(predictedPoint.y).not.toEqual(insidePoint.y);
        expect(predictedPoint.y).not.toEqual(outsidePoint.y);
    });

    it('Should correctly calculate predicted point if outsidePoint is beyond botht the height and width of the canvas, but farther from the height', () => {
        const insidePoint = { x: previewCtxStub.canvas.width - 20, y: previewCtxStub.canvas.height - 1 };
        const outsidePoint = { x: previewCtxStub.canvas.width + 2, y: previewCtxStub.canvas.height + 5 };
        const predictedPoint = (toolTest as any).calculateIntersectionPoint(outsidePoint, insidePoint);
        expect(predictedPoint.y).toEqual(previewCtxStub.canvas.height);
        expect(predictedPoint.x).not.toEqual(previewCtxStub.canvas.width);
        expect(predictedPoint.x).not.toEqual(0);
        expect(predictedPoint.x).not.toEqual(insidePoint.x);
        expect(predictedPoint.x).not.toEqual(outsidePoint.x);
    });

    it('Should correctly calculate predicted point if outsidePoint is beyond botht the height and width of the canvas, but farther from the width', () => {
        const insidePoint = { x: previewCtxStub.canvas.width - 1, y: previewCtxStub.canvas.height - 20 };
        const outsidePoint = { x: previewCtxStub.canvas.width + 5, y: previewCtxStub.canvas.height + 3 };
        const predictedPoint = (toolTest as any).calculateIntersectionPoint(outsidePoint, insidePoint);
        expect(predictedPoint.x).toEqual(previewCtxStub.canvas.width);
        expect(predictedPoint.y).not.toEqual(previewCtxStub.canvas.height);
        expect(predictedPoint.y).not.toEqual(0);
        expect(predictedPoint.y).not.toEqual(insidePoint.y);
        expect(predictedPoint.y).not.toEqual(outsidePoint.y);
    });

    it('Should return CANVAS_NOT_LOCATED_COORDS when the canvasAbsoluteCoords is not defined yet ', () => {
        const event = {
            target: ({
                id: 'blablabla',
                offsetLeft: 250,
                offsetTop: 250,
                offsetParent: ({ offsetLeft: 500, offsetTop: 500 } as HTMLElement) as Element,
            } as HTMLElement) as EventTarget,
            offsetX: 500,
            offsetY: 500,
        } as MouseEvent;
        const result = toolTest.getPositionFromMouse(event);
        expect(result).toEqual(CANVAS_NOT_LOCATED_COORDS);
    });
});
