export class Vec2 {
    x: number;
    y: number;

    constructor(value?: Vec2);
    constructor(x: number, y: number);
    constructor(xOrValue?: number | Vec2, y?: number) {
        if (xOrValue instanceof Vec2) {
            this.x = xOrValue.x;
            this.y = xOrValue.y;
        } else {
            this.x = xOrValue as number;
            this.y = y as number;
        }
    }

    equals(value: Vec2): boolean {
        return this.x === value.x && this.y === value.y;
    }
}
