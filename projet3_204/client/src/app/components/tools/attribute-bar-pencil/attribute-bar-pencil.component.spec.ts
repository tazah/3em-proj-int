import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { PencilService } from '@app/services/tools/pencil.service';
import { AttributeBarPencilComponent } from './attribute-bar-pencil.component';

// tslint:disable
describe('AttributeBarPencilComponent', () => {
    let component: AttributeBarPencilComponent;
    let fixture: ComponentFixture<AttributeBarPencilComponent>;
    let pencilServiceSpy: jasmine.SpyObj<PencilService>;

    beforeEach(async () => {
        pencilServiceSpy = jasmine.createSpyObj('PencilService', ['lineWidth']);

        TestBed.configureTestingModule({
            declarations: [AttributeBarPencilComponent],
            imports: [AppModule],
            providers: [{ provide: PencilService, useValue: pencilServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeBarPencilComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updateWidth should change the PencilService lineWidth attribute', () => {
        const value = 25;
        component.lineWidth = value;
        expect(pencilServiceSpy.lineWidth).toEqual(value);
    });

    it('should get the Pencil Service linewidth', () => {
        expect(component.lineWidth).toEqual(pencilServiceSpy.lineWidth);
    });
});
