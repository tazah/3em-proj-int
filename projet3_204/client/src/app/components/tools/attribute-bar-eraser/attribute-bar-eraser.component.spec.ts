import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { AppModule } from '@app/app.module';
import { EraserService } from '@app/services/tools/eraser.service';
import { AttributeBarEraserComponent } from './attribute-bar-eraser.component';

describe('AttributeBarEraserComponent', () => {
    let component: AttributeBarEraserComponent;
    let fixture: ComponentFixture<AttributeBarEraserComponent>;
    let eraserServiceSpy: jasmine.SpyObj<EraserService>;

    beforeEach(waitForAsync(() => {
        eraserServiceSpy = jasmine.createSpyObj('EraserService', ['lineWidth']);

        TestBed.configureTestingModule({
            declarations: [AttributeBarEraserComponent],
            imports: [AppModule],
            providers: [{ provide: EraserService, useValue: eraserServiceSpy }],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeBarEraserComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('updateWidth should change the eraser service lineWidth attribute', () => {
        const value = 11;
        component.lineWidth = value;
        expect(eraserServiceSpy.lineWidth).toEqual(value);
    });

    it('should get the eraser service linewidth', () => {
        expect(component.lineWidth).toEqual(eraserServiceSpy.lineWidth);
    });
});
