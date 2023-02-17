import { Point } from './point';

export enum Origin {
    WEB = 'WEB',
    MOBILE = 'MOBILE',
}
export enum Type {
    PENCIL = 'PENCIL',
    ELLIPSE = 'ELLIPSE',
    RECTANGLE = 'RECTANGLE',
}
export enum Style {
    STYLE1 = 'STYLE1',
    STYLE2 = 'STYLE2',
    STYLE3 = 'STYLE3',
}

export interface Movement {
    author: string;
    isSelected: boolean;
    origin: Origin;
    originHeight: number;
    originWidth: number;
    startPoint?: Point;
    endPoint?: Point;
    path?: Point[];
    color: string;
    secondaryColor?: string;
    type: Type;
    borderWidth: number;
    style: Style;
}
