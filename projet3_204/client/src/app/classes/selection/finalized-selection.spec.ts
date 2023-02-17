import { TestBed } from '@angular/core/testing';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionButtonPosition, SelectionState } from '@app/constants/tool.constants';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { FinalizedSelection } from './finalized-selection';
import { SelectionManager } from './selection-manager';

// tslint:disable: no-magic-numbers
// tslint:disable: no-string-literal
describe('FinalizedSelection', () => {
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let finalizedSelection: FinalizedSelection;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [SelectionService],
            providers: [],
            imports: [],
        }).compileComponents();
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', [
            'updateView',
            'getImageData',
            'updateShapeDataResizing',
            'drawPerimiter',
            'draw',
        ]);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['updateView', 'getPositionFromMouse', 'finishDrawing']);
        selectionServiceSpy.toolActionData = new SelectionActionData();

        TestBed.configureTestingModule({});

        finalizedSelection = new FinalizedSelection(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);

        selectionServiceSpy.buttonPos = [];
        selectionServiceSpy.buttonPos[SelectionButtonPosition.TopLeft] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.TopMiddle] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.TopRight] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.MiddleLeft] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.MiddleRight] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.BottomLeft] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.BottomMiddle] = new Vec2(0, 0);
        selectionServiceSpy.buttonPos[SelectionButtonPosition.BottomRight] = new Vec2(0, 0);
    });

    describe('moveDrawingWithKeyboard()', () => {
        it('should set the correct selection state', () => {
            finalizedSelection.moveDrawingWithKeyboard();
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.WaitingToMoveSelectionKeyboard);
        });
    });

    describe('onMouseUp()', () => {
        it('should call updateView() and set the appropriate selectionState', async () => {
            await finalizedSelection.onMouseUp({ offsetX: 50, offsetY: 50 } as MouseEvent);
            expect(selectionServiceSpy.finishDrawing).toHaveBeenCalled();
        });

        it('should return if clicked inside the selection box', async () => {
            const target = document.createElement('div');
            target.className = 'selection-rectangle';
            const event = { target: target as EventTarget } as MouseEvent;
            await finalizedSelection.onMouseUp(event);
            expect(selectionServiceSpy.selectionState).toBeUndefined();
            expect(selectionManagerSpy.updateView).not.toHaveBeenCalled();
        });

        it('should return if clicked on sidebars', async () => {
            selectionServiceSpy.getPositionFromMouse.and.returnValue(new Vec2(-20, -20));
            await finalizedSelection.onMouseUp({} as MouseEvent);
            expect(selectionServiceSpy.selectionState).toBeUndefined();
            expect(selectionManagerSpy.updateView).not.toHaveBeenCalled();
        });
    });

    describe('updateView()', () => {
        it('should call drawPerimiter', () => {
            finalizedSelection.updateView();
            expect(selectionManagerSpy.drawPerimiter).toHaveBeenCalled();
        });
    });

    describe('onMouseDown()', () => {
        it('should set the movingSelectionMouse state to ResizingSelection if the cursor is over a selection button', () => {
            finalizedSelection.onMouseDown({} as MouseEvent, false, true, SelectionButtonPosition.MiddleLeft);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.ResizingSelection);
        });

        it('should set the movingSelectionMouse state to MovingSelectionMouse if the cursor is over the Selection', () => {
            finalizedSelection.onMouseDown({} as MouseEvent, true, false, 4);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.MovingSelectionMouse);
        });

        it('Should set the state to Nothing if the mouse is not over the selection', () => {
            finalizedSelection.onMouseDown({} as MouseEvent, false, false, 4);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.DrawingSelectionBox);
        });

        it('Should set the state to Nothing if the mouse is not over the selection', () => {
            finalizedSelection.onMouseDown({} as MouseEvent, false);
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.DrawingSelectionBox);
        });
    });

    describe('finishDrawing()', () => {
        it('should set the selectionState to nothing and call updateView', () => {
            finalizedSelection.finishDrawing();
            expect(selectionServiceSpy.selectionState).toEqual(SelectionState.Nothing);
            expect(selectionManagerSpy.updateView).toHaveBeenCalled();
        });
    });

    describe('onKeyUp()', () => {
        it('should call finishDrawing if the key pressed is escape', () => {
            finalizedSelection.onKeyUp({ key: KeyboardButton.Escape } as KeyboardEvent);
            expect(selectionServiceSpy.finishDrawing).toHaveBeenCalled();
        });

        it('should do nothing if the key pressed is not escape', () => {
            finalizedSelection.onKeyUp({ key: KeyboardButton.ArrowDown } as KeyboardEvent);
            expect(selectionServiceSpy.finishDrawing).not.toHaveBeenCalled();
        });
    });
});
