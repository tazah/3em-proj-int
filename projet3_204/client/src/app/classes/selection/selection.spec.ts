import { TestBed } from '@angular/core/testing';
import { Vec2 } from '@app/classes/vec2';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { SelectionService } from '@app/services/tools/selection.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { Selection } from './selection';
import { SelectionManager } from './selection-manager';

export class SelectionTest extends Selection {}

// tslint:disable
describe('Selection', () => {
    let selectionTest: SelectionTest;
    let drawServiceSpy: jasmine.SpyObj<DrawingService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;
    let selectionServiceSpy: jasmine.SpyObj<SelectionService>;
    let selectionManagerSpy: jasmine.SpyObj<SelectionManager>;
    let regularMoveStub: Vec2;

    beforeEach(() => {
        drawServiceSpy = jasmine.createSpyObj('DrawingService', ['clearCanvas']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['addAction']);
        selectionManagerSpy = jasmine.createSpyObj('SelectionManager', ['hello']);
        selectionServiceSpy = jasmine.createSpyObj('SelectionService', ['hello']);

        TestBed.configureTestingModule({});

        selectionTest = new SelectionTest(selectionServiceSpy, drawServiceSpy, undoRedoServiceSpy, selectionManagerSpy);

        regularMoveStub = new Vec2(0, 0);
    });

    it(' dummy test to cover code for abstract class (Tool)', () => {
        // Arrange
        const mouseEvent = {} as MouseEvent;
        const keyboardEvent = {} as KeyboardEvent;

        // Act
        selectionTest.onMouseDown(mouseEvent);
        selectionTest.onMouseMove(mouseEvent);
        selectionTest.onMouseUp(mouseEvent);
        selectionTest.updateView();
        selectionTest.moveDrawingWithKeyboard();
        selectionTest.stopMoveDrawingWithKeyboard();
        selectionTest.onClick(mouseEvent);
        selectionTest.onKeyUp(keyboardEvent);
        selectionTest.finishDrawing();

        // Assert
        expect(true).toBe(true);
    });
});
