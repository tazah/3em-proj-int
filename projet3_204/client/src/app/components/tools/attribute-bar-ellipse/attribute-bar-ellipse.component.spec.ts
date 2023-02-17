import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { Style } from '@app/constants/style.constants';
import { EllipseService } from '@app/services/tools/ellipse.service';
import { AttributeBarEllipseComponent } from './attribute-bar-ellipse.component';

describe('AttributeBarEllipseComponent', () => {
    let component: AttributeBarEllipseComponent;
    let fixture: ComponentFixture<AttributeBarEllipseComponent>;
    let ellipseServiceSpy: jasmine.SpyObj<EllipseService>;

    beforeEach(waitForAsync(() => {
        ellipseServiceSpy = jasmine.createSpyObj('EllipseService', ['lineWidth']);
        TestBed.configureTestingModule({
            declarations: [AttributeBarEllipseComponent],
            imports: [AppModule],
            providers: [{ provide: EllipseService, useValue: ellipseServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeBarEllipseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updateWidth should change the EllipseService lineWidth attribute', () => {
        const value = 25;
        component.lineWidth = value;
        expect(ellipseServiceSpy.lineWidth).toEqual(value);
    });

    it('updateStyle should change the EllipseService ellipseStyle attribute', () => {
        component.shapeStyle = Style.All;
        expect(ellipseServiceSpy.shapeStyle).toEqual(Style.All);
    });
});
