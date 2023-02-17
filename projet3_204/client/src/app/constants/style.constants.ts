import { TooltipPosition } from '@angular/material/tooltip';

// Drawing component constants
export const DEFAULT_WIDTH = 1000;
export const DEFAULT_HEIGHT = 800;

export const DEFAULT_MARGINS = 10;

export const MIN_WIDTH = 250;
export const MIN_HEIGHT = 250;

// Sidebar component constants
export const DEFAULT_TOOLTIP_POSITION: TooltipPosition = 'right';
export const DEFAULT_TOOLTIP_DELAY = 500;

export const DEFAULT_SLIDER_STEP = 1;
export const MIN_SLIDER_VALUE = 1;
export const MAX_SLIDER_VALUE = 50;

export const TOOL_SIDEBAR_WIDTH = 130;
export const SIDEBARS_WIDTH = 335;

// Drawing service constants
export const DEFAULT_LINE_WIDTH = 1;
export const DEFAULT_POINT_DIAMETER = 1;
export const MAX_POINT_DIAMETER = 100;
export const DEFAULT_SIDES_NUMBER = 3;
export const MAX_SIDES_NUMBER = 12;

export const DEFAULT_ERASER_WIDTH = 5;

export const MAX_FILL_TOLERANCE = 100;
export const DEFAULT_FILL_TOLERANCE = 0;

export const MIN_ANGLE_VALUE = -180;
export const MAX_ANGLE_VALUE = 180;

// Because they are used in a constant array
// tslint:disable-next-line: no-magic-numbers
export const LINE_DASH: number[] = [5, 15];

export const BUTTON_POSITION = {
    Bottom: 'bottomResize',
    Right: 'rightResize',
    Corner: 'cornerResize',
};

export const BUTTON_SIDE_LENGTH = 7;

// Text service constants
export const DEFAULT_TEXT_SIZE = 20;
