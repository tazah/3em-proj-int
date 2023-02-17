import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { SelectionType } from '@app/constants/tool.constants';
import { SelectionService } from '@app/services/tools/selection.service';
import { AttributeBarSelectionComponent } from './attribute-bar-selection.component';

// tslint:disable: no-any
describe('AttributeBarSelectionComponent', () => {
    let component: AttributeBarSelectionComponent;
    let fixture: ComponentFixture<AttributeBarSelectionComponent>;
    let service: SelectionService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeBarSelectionComponent],
            imports: [AppModule],
        }).compileComponents();

        service = TestBed.inject(SelectionService);
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeBarSelectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('set type should set the correct type', () => {
        component.type = SelectionType.Ellipse;
        expect(component.type).toEqual(SelectionType.Ellipse);
    });

    describe('selectAllCanvas', () => {
        it('should call selectAllCanvas from SelectionService', () => {
            const spy = spyOn<any>(service, 'selectAllCanvas').and.returnValue(Promise.resolve());
            component.selectAllCanvas();
            expect(spy).toHaveBeenCalled();
        });
    });
});
