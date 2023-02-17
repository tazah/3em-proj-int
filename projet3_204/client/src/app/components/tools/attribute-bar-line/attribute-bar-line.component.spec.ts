import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { LineTypeJonctions } from '@app/constants/tool.constants';
import { LineService } from '@app/services/tools/line.service';
import { AttributeBarLineComponent } from './attribute-bar-line.component';

// tslint:disable
describe('AttributeBarLineComponent', () => {
    let component: AttributeBarLineComponent;
    let fixture: ComponentFixture<AttributeBarLineComponent>;
    let lineServiceSpy: jasmine.SpyObj<LineService>;

    beforeEach(async () => {
        lineServiceSpy = jasmine.createSpyObj('LineService', ['lineWidth']);

        TestBed.configureTestingModule({
            declarations: [AttributeBarLineComponent],
            imports: [AppModule],
            providers: [{ provide: LineService, useValue: lineServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeBarLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('lineWidth should change the LineService lineWidth attribute', () => {
        const value = 25;
        component.lineWidth = value;
        expect(lineServiceSpy.lineWidth).toEqual(value);
    });

    it('pointDiameter should change the LineService pointDiameter attribute', () => {
        const value = 25;
        component.pointDiameter = value;
        expect(lineServiceSpy.pointDiameter).toEqual(value);
    });

    it('pointDiameter should change the LineService pointDiameter attribute', () => {
        const value = 25;
        component.pointDiameter = value;
        expect(lineServiceSpy.pointDiameter).toEqual(value);
    });

    it('value for pointDiameter greater than max should become max', () => {
        const value = 700;
        component.pointDiameter = value;
        expect(component.pointDiameter).not.toEqual(component.maxPointDiameter);
    });

    it('value for pointDiameter lower than min should become min', () => {
        const value = -1;
        component.pointDiameter = value;
        expect(lineServiceSpy.pointDiameter).not.toEqual(component.minPointDiameter);
    });

    it('Should set the value for typeJonction', () => {
        component.typeJonction = LineTypeJonctions.AvecPoints;
        expect(lineServiceSpy.typeJonction).toEqual(LineTypeJonctions.AvecPoints);
    });
});
