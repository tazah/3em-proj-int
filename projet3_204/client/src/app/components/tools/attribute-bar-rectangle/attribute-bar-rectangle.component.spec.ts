import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { Style } from '@app/constants/style.constants';
import { RectangleService } from '@app/services/tools/rectangle.service';
import { AttributeBarRectangleComponent } from './attribute-bar-rectangle.component';

// tslint: disable
describe('AttributeBarRectangleComponent', () => {
    let component: AttributeBarRectangleComponent;
    let fixture: ComponentFixture<AttributeBarRectangleComponent>;
    let rectangleServiceSpy: jasmine.SpyObj<RectangleService>;

    beforeEach(waitForAsync(() => {
        rectangleServiceSpy = jasmine.createSpyObj('RectangleService', ['lineWidth']);

        TestBed.configureTestingModule({
            declarations: [AttributeBarRectangleComponent],
            imports: [AppModule],
            providers: [{ provide: RectangleService, useValue: rectangleServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeBarRectangleComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updateWidth should change the RectangleService lineWidth attribute', () => {
        const value = 25;
        component.lineWidth = value;
        expect(rectangleServiceSpy.lineWidth).toEqual(value);
    });

    it('updateStyle should change the RectangleService rectangleStyle attribute', () => {
        component.shapeStyle = Style.All;
        expect(rectangleServiceSpy.shapeStyle).toEqual(Style.All);
    });
});
