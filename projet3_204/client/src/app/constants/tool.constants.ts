import { Vec2 } from '@app/classes/vec2';

export enum ToolKey {
    Mouse = 'F',
    Eraser = 'E',
    Pencil = 'C',
    Line = 'L',
    Rectangle = '1',
    Ellipse = '2',
    Selection = 'R',
}

export const toolDict: { key: ToolKey; id: string; name: string; loadedSvg: string }[] = [
    { key: ToolKey.Mouse, id: 'mouse-tool-bouton', name: 'Souris', loadedSvg: 'mdi-cursor-default' },
    { key: ToolKey.Eraser, id: 'eraser-tool-bouton', name: 'Efface', loadedSvg: 'mdi-eraser' },
    { key: ToolKey.Pencil, id: 'pencil-tool-bouton', name: 'Crayon', loadedSvg: 'mdi-pencil-outline' },
    { key: ToolKey.Line, id: 'line-tool-bouton', name: 'Ligne', loadedSvg: 'mdi-vector-line' },
    { key: ToolKey.Rectangle, id: 'rectangle-tool-bouton', name: 'Rectangle', loadedSvg: 'mdi-vector-rectangle' },
    { key: ToolKey.Ellipse, id: 'ellipse-tool-bouton', name: 'Ellipse', loadedSvg: 'mdi-vector-ellipse' },
    { key: ToolKey.Selection, id: 'selection-tool-bouton', name: 'Outil de sélection', loadedSvg: 'mdi-selection-drag' },
];

export const SELECTION_ELLIPSE_KEY = 'S';
export const SELECTION_LASSO_KEY = 'V';

export enum LineTypeJonctions {
    Normale = '0',
    AvecPoints = '1',
}

export type PathPoint = { point: Vec2; shouldMoveTo: boolean };

// tslint:disable-next-line: no-magic-numbers <- It's a constant
export const CANVAS_NOT_LOCATED_COORDS = new Vec2(999999, 999999);

// Selection constants
export enum SelectionType {
    Rectangle,
    Ellipse,
    Lasso,
}

export enum SelectionState {
    Nothing,
    DrawingSelectionBox,
    SomethingHasBeenSelected,
    MovingSelectionMouse,
    WaitingToMoveSelectionKeyboard,
    MovingSelectionKeyboard,
    ResizingSelection,
}

export const SELECTION_BEGINNING_WAIT_KEYBAORD = 500;
export const SELECTION_SUBSEQUENT_WAIT_KEYBAORD = 100;
export const SELECTION_KEYBOARD_MOVE_DISTANCE = 3;

export enum SelectionButtonPosition {
    TopLeft = 0,
    TopMiddle = 1,
    TopRight = 2,
    MiddleLeft = 3,
    MiddleRight = 4,
    BottomLeft = 5,
    BottomMiddle = 6,
    BottomRight = 7,
}

// Pain seal constants
export const COLORS_NUMBER = 3;
export const TOLERANCE_FACTOR = 100;

export const MINIMUM_POINTS_SELECTION_LASSO = 3;
export const FONT_SELECTION_OPTIONS = [
    { value: 'fira', viewValue: 'Fira Sans Condensed' },
    { value: 'baskerville', viewValue: 'Libre Baskerville' },
    { value: 'indie', viewValue: 'Indie Flower' },
    { value: 'dancing', viewValue: 'Dancing Script' },
    { value: 'train', viewValue: 'Train One' },
];

export enum Align {
    Center = 'center',
    Left = 'left',
    Right = 'right',
}

export const FILL_PIXEL_BYTES = 4;
