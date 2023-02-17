import { Injectable } from '@angular/core';
import { SelectionActionData } from '@app/classes/actions/selection-action-data';
import { EllipseSelectionManager } from '@app/classes/selection/ellipse-selection-manager';
import { LassoSelectionManager } from '@app/classes/selection/lasso-selection-manager';
import { RectangleSelectionManager } from '@app/classes/selection/rectangle-selection-manager';
import { SelectionManager } from '@app/classes/selection/selection-manager';
import { Tool } from '@app/classes/tool';
import { Vec2 } from '@app/classes/vec2';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { SelectionButtonPosition, SelectionState, SelectionType } from '@app/constants/tool.constants';
import { ColorService } from '@app/services/color/color.service';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { UserAuthentificationService } from '../authentification/UserAuthentification.service';
import { ChatCommunicationService } from '../chat/chat-communication.service';

@Injectable({
    providedIn: 'root',
})
export class SelectionService extends Tool {
    private rectangleSelectionManager: RectangleSelectionManager = new RectangleSelectionManager(this, this.drawingService, this.undoRedoService);
    private ellipseSelectionManager: EllipseSelectionManager = new EllipseSelectionManager(this, this.drawingService, this.undoRedoService);
    private lassoSelectionManager: LassoSelectionManager = new LassoSelectionManager(this, this.drawingService, this.undoRedoService);

    private managers: Map<SelectionType, SelectionManager> = new Map<SelectionType, SelectionManager>([
        [SelectionType.Ellipse, this.ellipseSelectionManager],
        [SelectionType.Lasso, this.lassoSelectionManager],
        [SelectionType.Rectangle, this.rectangleSelectionManager],
    ]);

    constructor(
        drawingService: DrawingService,
        colorService: ColorService,
        undoRedoService: UndoRedoService,
        chatCommunicationService: ChatCommunicationService,
        userAuthentificationService: UserAuthentificationService,
    ) {
        super(drawingService, colorService, undoRedoService, chatCommunicationService, userAuthentificationService);
    }

    // tslint:disable-next-line: variable-name <- Because we are using a getter and a setter
    private _selectionState: SelectionState = SelectionState.Nothing;
    intervalRef: null | ReturnType<typeof setInterval> = null;
    toolActionData: SelectionActionData = new SelectionActionData();
    mouseDownPosition: Vec2 = new Vec2();
    mousePosition: Vec2 = new Vec2();
    shiftDown: boolean = false;
    arrowsPressed: Map<string, boolean> = new Map([
        [KeyboardButton.ArrowLeft, false],
        [KeyboardButton.ArrowRight, false],
        [KeyboardButton.ArrowUp, false],
        [KeyboardButton.ArrowDown, false],
    ]);
    buttonPos: Vec2[] = [];
    initialPositionBeforeMove: Vec2;
    initialTopLeftCornerBeforeMove: Vec2;
    initialWidthBeforeReize: number;
    initialHeightBeforeReize: number;
    buttonCurrentlyMoving: SelectionButtonPosition;
    private nextSelectionType: SelectionType = this.toolActionData.type;

    onMouseUp(event: MouseEvent): void {
        this.currentSelectionManager.onMouseUp(event);
    }

    onMouseDown(event: MouseEvent, isOverSelection: boolean = false, isOverButton: boolean = false, button?: SelectionButtonPosition): void {
        this.currentSelectionManager.onMouseDown(event, isOverSelection, isOverButton, button);
    }

    onMouseMove(event: MouseEvent): void {
        this.currentSelectionManager.onMouseMove(event);
    }

    onClick(event: MouseEvent): void {
        this.currentSelectionManager.onClick(event);
    }

    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        this.currentSelectionManager.onKeyDown(event);
    }

    onKeyUp(event: KeyboardEvent): void {
        this.currentSelectionManager.onKeyUp(event);
    }

    draw(drawToBaseCanvas: boolean, actionData: SelectionActionData, recordAction?: boolean): void {
        (this.managers.get(this.toolActionData.type) as SelectionManager).draw(drawToBaseCanvas, actionData, recordAction);
    }

    finishDrawing(): void {
        this.currentSelectionManager.finishDrawing();
        this.toolActionData.pathData = [];
        this.syncSelectionState();
    }

    updateControlPointsPositions(): void {
        this.buttonPos[SelectionButtonPosition.TopLeft] = new Vec2(this.topLeftCorner.x, this.topLeftCorner.y);
        this.buttonPos[SelectionButtonPosition.TopMiddle] = new Vec2(this.topLeftCorner.x + this.width / 2, this.topLeftCorner.y);
        this.buttonPos[SelectionButtonPosition.TopRight] = new Vec2(this.topLeftCorner.x + this.width, this.topLeftCorner.y);
        this.buttonPos[SelectionButtonPosition.MiddleLeft] = new Vec2(this.topLeftCorner.x, this.topLeftCorner.y + this.height / 2);
        this.buttonPos[SelectionButtonPosition.MiddleRight] = new Vec2(this.topLeftCorner.x + this.width, this.topLeftCorner.y + this.height / 2);
        this.buttonPos[SelectionButtonPosition.BottomLeft] = new Vec2(this.topLeftCorner.x, this.topLeftCorner.y + this.height);
        this.buttonPos[SelectionButtonPosition.BottomMiddle] = new Vec2(this.topLeftCorner.x + this.width / 2, this.topLeftCorner.y + this.height);
        this.buttonPos[SelectionButtonPosition.BottomRight] = new Vec2(this.topLeftCorner.x + this.width, this.topLeftCorner.y + this.height);
    }

    async selectAllCanvas(): Promise<void> {
        this.selectionState = SelectionState.DrawingSelectionBox;
        this.toolActionData.type = SelectionType.Rectangle;
        this.mouseDownPosition = new Vec2(0, 0);
        this.mousePosition = new Vec2(this.drawingService.canvas.width, this.drawingService.canvas.height);
        this.currentSelectionManager.updateShapeDataResizing();
        await this.currentSelectionManager.getImageData();
        this.selectionState = SelectionState.SomethingHasBeenSelected;
        this.currentSelectionManager.updateView();
    }

    get currentSelectionManager(): SelectionManager {
        return this.managers.get(this.toolActionData.type) as SelectionManager;
    }

    get width(): number {
        if (this.selectionState === SelectionState.DrawingSelectionBox) return this.toolActionData.oldSelectionWidth;
        return this.toolActionData.newSelectionWidth;
    }

    set width(value: number) {
        if (this.selectionState === SelectionState.DrawingSelectionBox) this.toolActionData.oldSelectionWidth = value;
        this.toolActionData.newSelectionWidth = value;
    }

    get height(): number {
        if (this.selectionState === SelectionState.DrawingSelectionBox) return this.toolActionData.oldSelectionHeight;
        return this.toolActionData.newSelectionHeight;
    }

    set height(value: number) {
        if (this.selectionState === SelectionState.DrawingSelectionBox) this.toolActionData.oldSelectionHeight = value;
        this.toolActionData.newSelectionHeight = value;
    }

    get topLeftCorner(): Vec2 {
        if (this.selectionState === SelectionState.DrawingSelectionBox) return this.toolActionData.oldSelectionTopLeftCorner;
        return this.toolActionData.newSelectionTopLeftCorner;
    }

    set topLeftCorner(value: Vec2) {
        if (this.selectionState === SelectionState.DrawingSelectionBox) this.toolActionData.oldSelectionTopLeftCorner = new Vec2(value);
        this.toolActionData.newSelectionTopLeftCorner = new Vec2(value);
    }

    get selectionState(): SelectionState {
        return this._selectionState;
    }

    set selectionState(value: SelectionState) {
        if (value === SelectionState.Nothing) this.started = false;
        else if (value === SelectionState.SomethingHasBeenSelected) this.updateControlPointsPositions();
        this._selectionState = value;
    }

    onSwitch(toolActionData?: SelectionActionData): void {
        if (toolActionData) this.toolActionData.type = toolActionData.type;
    }

    onSwitchOff(): void {
        this.finishDrawing();
    }

    private syncSelectionState(): void {
        this.toolActionData.type = this.nextSelectionType;
    }

    set selectionType(value: SelectionType) {
        this.nextSelectionType = value;
        if (this.selectionState === SelectionState.Nothing) {
            this.syncSelectionState();
        }
    }

    get selectionType(): SelectionType {
        return this.nextSelectionType;
    }
}
