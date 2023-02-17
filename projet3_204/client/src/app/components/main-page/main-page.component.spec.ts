import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync as  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppModule } from '@app/app.module';
import { DialogService } from '@app/services/dialog/dialog.service';
import { UndoRedoService } from '@app/services/undo-redo/undo-redo.service';
import { MainPageComponent } from './main-page.component';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let dialogServiceSpy: jasmine.SpyObj<DialogService>;
    let undoRedoServiceSpy: jasmine.SpyObj<UndoRedoService>;

    beforeEach(waitForAsync(() => {
        dialogServiceSpy = jasmine.createSpyObj('DialogService', ['switchDialog']);
        undoRedoServiceSpy = jasmine.createSpyObj('UndoRedoService', ['newDrawing', 'loadDrawing']);
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule, HttpClientModule],
            declarations: [MainPageComponent],
            providers: [
                { provide: DialogService, useValue: dialogServiceSpy },
                { provide: UndoRedoService, useValue: undoRedoServiceSpy },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'PolyDessin 2'", () => {
        expect(component.title).toEqual('PolyDessin 2');
    });

    it('openCarroussel should switch the dialog', () => {
        component.openCarrousel();
        expect(dialogServiceSpy.switchDialog).toHaveBeenCalled();
    });

    describe('newDrawing()', () => {
        it('should call the undoRedoService newDrawing', () => {
            component.newDrawing();
            expect(undoRedoServiceSpy.newDrawing).toHaveBeenCalled();
        });
    });
});
