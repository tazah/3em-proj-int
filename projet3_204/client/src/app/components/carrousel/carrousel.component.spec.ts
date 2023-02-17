import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { AppModule } from '@app/app.module';
import { KeyboardButton } from '@app/constants/keyboard.constants';
import { CarrouselService } from '@app/services/carrousel/carrousel.service';
import { Drawing } from '@common/classes/drawing';
import { CarrouselComponent } from './carrousel.component';

// tslint:disable: no-string-literal
// tslint:disable: no-magic-numbers
// tslint:disable: no-any
describe('CarrouselComponent', () => {
    let component: CarrouselComponent;
    let fixture: ComponentFixture<CarrouselComponent>;
    let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CarrouselComponent>>;
    let carrouselServiceSpy: jasmine.SpyObj<CarrouselService>;
    let currentThreeDrawingsSpy: jasmine.Spy<any>;

    beforeEach(() => {
        dialogRefSpy = jasmine.createSpyObj('MatDialogRef<CarrouselComponent>', ['close']);
        carrouselServiceSpy = jasmine.createSpyObj('CarrouselService', [
            'loadImagesFromServer',
            'onCancel',
            'deleteDrawing',
            'filterDrawings',
            'continueDrawing',
        ]);
        const tags: string[] = [];
        tags.push('tag1,');
        tags.push('tag2');
        const d1 = { _id: '1', title: 'titre 1', tags, image: '' };
        const d2 = { _id: '2', title: 'titre 2', tags, image: '' };
        const d3 = { _id: '3', title: 'titre 3', tags, image: '' };

        const drawings: Drawing[] = [];
        drawings.push(d1);
        drawings.push(d2);
        drawings.push(d3);
        carrouselServiceSpy.drawings = drawings;
        carrouselServiceSpy.filteredDrawings = drawings;

        TestBed.configureTestingModule({
            declarations: [CarrouselComponent],
            providers: [
                { provide: MatDialogRef, useValue: dialogRefSpy },
                { provide: CarrouselService, useValue: carrouselServiceSpy },
            ],

            imports: [AppModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CarrouselComponent);
        component = fixture.componentInstance;

        component.onlyThreeDrawings = drawings;
        component.tags = tags;

        fixture.detectChanges();

        currentThreeDrawingsSpy = spyOn<any>(component, 'currentThreeDrawings');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should add a tag', () => {
        const inputTest = {} as HTMLInputElement;
        const valueTest = 'hello';
        const event: MatChipInputEvent = {
            input: inputTest,
            value: valueTest,
        };
        component.tags = ['test', 'bye'];
        component.add(event);
        expect(component.tags.length).toEqual(3);
    });

    describe('add()', () => {
        it('should add a tag', () => {
            const inputTest = {} as HTMLInputElement;
            const valueTest = 'hello';
            const event: MatChipInputEvent = {
                input: inputTest,
                value: valueTest,
            };
            component.tags = ['test', 'bye'];
            component.add(event);
            expect(component.tags.length).toEqual(3);
        });

        it('should add a tag', () => {
            const inputTest = {} as HTMLInputElement;
            const valueTest = '';
            const event: MatChipInputEvent = {
                input: inputTest,
                value: valueTest,
            };
            component.tags = ['test', 'bye'];
            component.add(event);
            expect(component.tags.length).not.toEqual(3);
        });

        it('should not set input value as an empty string if it is undefined', () => {
            const valueTest = '';
            const event: MatChipInputEvent = {
                input: (undefined as unknown) as HTMLInputElement,
                value: valueTest,
            };
            component.tags = ['test', 'bye'];
            component.add(event);
            expect(event.input).toBeUndefined();
        });
    });

    describe('onTagClick()', () => {
        it('should call currentThreeDrawings', () => {
            component.onTagClick('tag1');
            expect(currentThreeDrawingsSpy).toHaveBeenCalled();
        });
        it('should return if tag is empty', () => {
            component.onTagClick('');
            expect(currentThreeDrawingsSpy).not.toHaveBeenCalled();
        });

        it('should return if the tag is already in the tags', () => {
            component.tags = ['tag1'];
            component.onTagClick('tag1');
            expect(currentThreeDrawingsSpy).not.toHaveBeenCalled();
        });
    });

    describe('continueDrawing()', () => {
        it('should call carrouselService.continueDrawing', () => {
            component.continueDrawing('imgUrl');
            expect(carrouselServiceSpy.continueDrawing).toHaveBeenCalled();
        });
    });

    describe('remove()', () => {
        it('should remove tag', () => {
            component.tags = ['test', 'hello'];
            component.remove('hola');
            expect(component.tags[0]).toEqual('test');
        });
        it('should remove tag', () => {
            component.tags = ['test', 'hello'];
            component.remove('test');
            expect(component.tags[0]).toEqual('hello');
        });
    });

    describe('onCancel()', () => {
        it('should close the dialogRef', () => {
            component.onCancel();
            expect(carrouselServiceSpy.onCancel).toHaveBeenCalled();
        });
    });

    describe('onSave()', () => {
        it('should call onCancel()', () => {
            const onCancelSpy = spyOn<any>(component, 'onCancel');
            component.onSave();
            expect(onCancelSpy).toHaveBeenCalled();
        });
    });

    describe('previousPage()', () => {
        it('should call currentThreeDrawings()', () => {
            const drawing = { _id: '1', title: 'titre 1', tags: ['tag1'], image: '' };
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['currentPage'] = 0;
            component.previousPage();
            expect(component['currentPage']).toEqual(component.lastPage);
            expect(currentThreeDrawingsSpy).toHaveBeenCalled();
        });

        it('should do nothing if drawingsNumber < DRAWINGS_NUMBER', () => {
            const oldCurrentPage = component['currentPage'];
            carrouselServiceSpy.drawings = [];
            component.previousPage();
            expect(oldCurrentPage).toEqual(component['currentPage']);
        });
    });

    describe('nextPage()', () => {
        it('should call currentThreeDrawings()', () => {
            const drawing = { _id: '1', title: 'titre 1', tags: ['tag1'], image: '' };

            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);
            component['carrouselService'].filteredDrawings.push(drawing);

            component['currentPage'] = 0;

            component.nextPage();
            expect(component['currentPage']).toEqual(1);

            expect(currentThreeDrawingsSpy).toHaveBeenCalled();
        });

        it('should do nothing if drawingsNumber < DRAWINGS_NUMBER', () => {
            const oldCurrentPage = component['currentPage'];
            carrouselServiceSpy.drawings = [];
            component.nextPage();
            expect(oldCurrentPage).toEqual(component['currentPage']);
        });
    });

    describe('onKeyDown()', () => {
        it('should call previousPage() if event.key=ArrowLeft', () => {
            const previousPageSpy = spyOn<any>(component, 'previousPage');
            const event: KeyboardEvent = {
                key: KeyboardButton.ArrowLeft,
            } as KeyboardEvent;

            component.onKeyDown(event);

            expect(previousPageSpy).toHaveBeenCalled();
        });

        it('should call nextPage() if event.key=ArrowRight', () => {
            const nextPageSpy = spyOn<any>(component, 'nextPage');
            const event: KeyboardEvent = {
                key: KeyboardButton.ArrowRight,
            } as KeyboardEvent;

            component.onKeyDown(event);

            expect(nextPageSpy).toHaveBeenCalled();
        });
    });

    describe('drawingsNumber', () => {
        it('should return the good number of carrouselService.drawings', () => {
            expect(component.drawingsNumber).toEqual(3);
        });
    });

    describe('currentThreeDrawings()', () => {
        it('should break if carrouselService.drawings[i] is empty', () => {
            component['currentPage'] = 0;
            currentThreeDrawingsSpy.and.callThrough();
            const getDrawingsSpy = spyOn<any>(component, 'getDrawings').and.returnValue([] as Drawing[]);
            const returnValues = component.currentThreeDrawings();
            expect(getDrawingsSpy).toHaveBeenCalled();
            expect(returnValues).toBeDefined();
            expect(returnValues).toEqual([] as Drawing[]);
        });
    });

    describe('pageLabelString', () => {
        it('should return the appropriate value', () => {
            component['currentPage'] = 10;
            spyOn<any>(component, 'pageLabelString').and.callThrough();
            const returnValues = component.pageLabelString;
            expect(returnValues).toEqual('31 – 3 de 3' as string);
        });
    });

    describe('deleteDrawing()', () => {
        it('should return the appropriate value', () => {
            const drawing = { _id: '1', title: 'titre 1', tags: ['tag1'], image: '' };
            component.deleteDrawing(drawing);
            expect(carrouselServiceSpy.deleteDrawing).toHaveBeenCalled();
        });
    });
});
