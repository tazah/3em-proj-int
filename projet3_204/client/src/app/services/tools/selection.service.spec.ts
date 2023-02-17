import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { Vec2 } from '@app/classes/vec2';
import { SelectionButtonPosition, SelectionState, SelectionType } from '@app/constants/tool.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';

// tslint:disable: no-any
// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-empty
describe('SelectionService', () => {
    let service: SelectionService;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    const colorServiceStub: ColorService = new ColorService();
    let undoRedoStub: UndoRedoService;

    let canvasTestHelper: CanvasTestHelper;
    let baseCtxStub: CanvasRenderingContext2D;
    let previewCtxStub: CanvasRenderingContext2D;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoStub = new UndoRedoService(drawServiceSpy);

        TestBed.configureTestingModule({
            providers: [
                { provide: DrawingService, useValue: drawServiceSpy },
                { provide: ColorService, useValue: colorServiceStub },
                { provide: UndoRedoService, useValue: undoRedoStub },
            ],
        });
        service = TestBed.inject(SelectionService);
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
        baseCtxStub = canvasTestHelper.canvas.getContext('2d') as CanvasRenderingContext2D;
        previewCtxStub = canvasTestHelper.drawCanvas.getContext('2d') as CanvasRenderingContext2D;

        service['drawingService'].baseCtx = baseCtxStub;
        service['drawingService'].previewCtx = previewCtxStub;
        service['drawingService'].canvas = canvasTestHelper.canvas;

        service.mousePosition = new Vec2(100, 100);
        service.mouseDownPosition = new Vec2(100, 100);

        service.topLeftCorner = new Vec2(0, 0);
        service.toolActionData.newSelectionTopLeftCorner = service.topLeftCorner;
        service.toolActionData.oldSelectionTopLeftCorner = service.topLeftCorner;
        service.width = 100;
        service.toolActionData.newSelectionWidth = service.width;
        service.toolActionData.oldSelectionWidth = service.width;
        service.height = 100;
        service.toolActionData.newSelectionHeight = service.height;
        service.toolActionData.oldSelectionHeight = service.height;
        service.selectionState = SelectionState.Nothing;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('onMouseUp()', () => {
        it('should call the selectionManager s onMouseUp', () => {
            const onMouseUpSpy = spyOn<any>(service['currentSelectionManager'], 'onMouseUp').and.returnValue(Promise.resolve());
            const event = {} as MouseEvent;
            service.onMouseUp(event);
            expect(onMouseUpSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('onMouseDown()', () => {
        it('should call the selectionManager s onMouseDown', () => {
            const onMouseDownSpy = spyOn<any>(service['currentSelectionManager'], 'onMouseDown');
            const event = {} as MouseEvent;
            service.onMouseDown(event);
            expect(onMouseDownSpy).toHaveBeenCalled();
        });
    });

    describe('onMouseMove()', () => {
        it('should call the selectionManager s onMouseMove', () => {
            const onMouseMoveSpy = spyOn<any>(service['currentSelectionManager'], 'onMouseMove');
            const event = {} as MouseEvent;
            service.onMouseMove(event);
            expect(onMouseMoveSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('onKeyDown()', () => {
        it('should call the selectionManager s onKeyDown', () => {
            const onKeyDownSpy = spyOn<any>(service['currentSelectionManager'], 'onKeyDown');
            const event = { preventDefault: () => {} } as KeyboardEvent;
            service.onKeyDown(event);
            expect(onKeyDownSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('onKeyUp()', () => {
        it('should call the selectionManager s onKeyUp', () => {
            const onKeyUpSpy = spyOn<any>(service['currentSelectionManager'], 'onKeyUp');
            const event = {} as KeyboardEvent;
            service.onKeyUp(event);
            expect(onKeyUpSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('draw()', () => {
        it('should call the selectionManager s draw', () => {
            const drawSpy = spyOn<any>(service['currentSelectionManager'], 'draw');
            service.draw(false, service['toolActionData'], false);
            expect(drawSpy).toHaveBeenCalledWith(false, service['toolActionData'], false);
        });
    });

    describe('updateControlPointsPositions()', () => {
        it('should update the button positions', () => {
            service['topLeftCorner'] = new Vec2(1, 1);
            const oldButtonPositions = new Vec2(service['buttonPos'][SelectionButtonPosition.TopLeft]);
            service['topLeftCorner'] = new Vec2(500, 500);
            service.updateControlPointsPositions();
            expect(oldButtonPositions.equals(service['buttonPos'][SelectionButtonPosition.TopLeft])).toBeFalse();
        });
    });

    describe('selectAllCanvas()', () => {
        it('should change the selectionState', async () => {
            const getImageDataSpy = spyOn<any>(service['currentSelectionManager'], 'getImageData').and.returnValue(Promise.resolve());
            const updateViewSpy = spyOn<any>(service['currentSelectionManager'], 'updateView').and.stub();
            await service.selectAllCanvas();
            expect(service.selectionState).toEqual(SelectionState.SomethingHasBeenSelected);
            expect(getImageDataSpy);
            expect(updateViewSpy);
        });
    });

    describe('onSwitch()', () => {
        it('should set the correct selectionManagerType', () => {
            const toolActiondata = {
                type: SelectionType.Ellipse,
            } as SelectionActionData;

            service.onSwitch(toolActiondata);
            expect(service.toolActionData.type).toBe(toolActiondata.type);
        });

        it('should do nothing if nothing is passed as an argument', () => {
            const oldSelectionState = service.toolActionData.type;
            service.onSwitch();
            expect(service.toolActionData.type).toEqual(oldSelectionState);
        });
    });

    describe('selectionState', () => {
        it('should set started to false if value is SelectionState.Nothing', () => {
            service.started = true;
            service.selectionState = SelectionState.Nothing;
            expect(service.started).toBeFalse();
        });
    });
    describe('selectionType', () => {
        it('should call syncSlectionState if selectionState=SelectionState.Nothing', () => {
            const spy = spyOn<any>(service, 'syncSelectionState');
            const typeTest = SelectionType.Ellipse;
            service.selectionState = SelectionState.ResizingSelection;
            service.selectionType = typeTest;
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('onClick()', () => {
        it('should call the currentSelectionManager onClick', () => {
            const onClickSpy = spyOn<any>(service['currentSelectionManager'], 'onClick');
            const event = {} as MouseEvent;
            service.onClick(event);
            expect(onClickSpy).toHaveBeenCalledWith(event);
        });
    });

    describe('finishDrawing()', () => {
        it('finishDrawing() should call finishDrawing and syncSelectionState()', () => {
            const spyFinishDrawing = spyOn<any>(service['currentSelectionManager'], 'finishDrawing');
            const spySyncSelectionState = spyOn<any>(service, 'syncSelectionState').and.callThrough();

            service.finishDrawing();

            expect(spyFinishDrawing).toHaveBeenCalled();
            expect(spySyncSelectionState).toHaveBeenCalled();
        });
    });

    describe('onSwitchOff()', () => {
        it('onSwitchOff() should call and finishDrawing()', () => {
            const spy = spyOn<any>(service, 'finishDrawing');
            service.onSwitchOff();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('selectionType', () => {
        it('should call syncSelectionState if the selectionState is nothing', () => {
            service.selectionState = SelectionState.Nothing;
            const syncSelectionStateSpy = spyOn<any>(service, 'syncSelectionState');
            service.selectionType = SelectionType.Lasso;
            expect(syncSelectionStateSpy).toHaveBeenCalled();
        });

        it('should do nothing if the selectionState not nothing', () => {
            service.selectionState = SelectionState.MovingSelectionKeyboard;
            const syncSelectionStateSpy = spyOn<any>(service, 'syncSelectionState');
            service.selectionType = SelectionType.Lasso;
            expect(syncSelectionStateSpy).not.toHaveBeenCalled();
        });
    });
});
