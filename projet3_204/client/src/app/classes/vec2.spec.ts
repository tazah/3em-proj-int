import { Vec2 } from './vec2';

describe('Vec2', () => {
    let vector: Vec2;

    beforeEach(() => {
        vector = new Vec2(2, 2);
    });

    describe('constructor', () => {
        it('should assign the correct values if x and y are passed', () => {
            expect(vector.x).toEqual(2);
            expect(vector.y).toEqual(2);
        });

        it('should assign the correct values if another vector is passed', () => {
            const newVector = new Vec2(vector);
            expect(newVector.equals(vector)).toBeTrue();
        });

        it('should leave x and y undefined if no arguments are passed', () => {
            vector = new Vec2();
            expect(vector.x).toBeUndefined();
            expect(vector.y).toBeUndefined();
        });
    });

    describe('equals()', () => {
        it('should return the correct value', () => {
            expect(vector.equals(new Vec2(2, 2))).toBeTrue();
        });
    });
});
