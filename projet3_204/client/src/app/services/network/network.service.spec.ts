import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppModule } from '@app/app.module';
import { BASE_URL } from '@app/constants/networking.constants';
import { Drawing } from '@common/classes/drawing';
import { Message } from '@common/classes/message';
import { NetworkService } from './network.service';

// tslint:disable: no-any
describe('NetworkService', () => {
    let httpMock: HttpTestingController;
    let service: NetworkService;
    let snackBarMock: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        snackBarMock = jasmine.createSpyObj('SnakeBar', ['open']);

        TestBed.configureTestingModule({
            providers: [{ provide: MatSnackBar, useValue: snackBarMock }],
            imports: [AppModule, HttpClientTestingModule],
        });
        service = TestBed.inject(NetworkService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('sendDrawing()', () => {
        it('should call showSnackbarMessage on error', () => {
            const expectedMessage: Message = { body: 'Hello', title: 'World' };
            const showSnackbarMessageSpy = spyOn<any>(service, 'showSnackbarMessage').and.callThrough();
            service.sendDrawing({} as Drawing).then(() => {
                expect(showSnackbarMessageSpy).toHaveBeenCalledWith(expectedMessage.title + ' ' + expectedMessage.body);
            }, fail);

            const req = httpMock.expectOne(BASE_URL + 'drawings');
            expect(req.request.method).toBe('POST');
            // actually send the request
            req.flush(expectedMessage);
        });

        it('should handle exceptions', () => {
            const showSnackbarMessageSpy = spyOn<any>(service, 'showSnackbarMessage').and.callThrough();
            service.sendDrawing({} as Drawing).then(() => {
                expect(showSnackbarMessageSpy).toHaveBeenCalledWith('Hello');
            }, fail);

            const req = httpMock.expectOne(BASE_URL + 'drawings');
            expect(req.request.method).toBe('POST');
            // actually send the request
            req.error(new ErrorEvent('Hello'));
        });
    });

    describe('getAllDrawings()', () => {
        it('should get drawings from URL', () => {
            const expectedResult = [] as Drawing[];
            service.getAllDrawings().then((result: Drawing[]) => {
                expect(result).toEqual(expectedResult);
            }, fail);

            const req = httpMock.expectOne(BASE_URL + 'drawings');
            expect(req.request.method).toBe('GET');
            // actually send the request
            req.flush(expectedResult);
        });
    });

    describe('deleteDrawing()', () => {
        it('should delete a specific drawing', () => {
            const drawingToBeDeleted = { _id: 'abc' } as Drawing;
            const expectedMessage: Message = { body: 'Hello', title: 'World' };
            const showSnackbarMessageSpy = spyOn<any>(service, 'showSnackbarMessage').and.callThrough();
            service.deleteDrawing(drawingToBeDeleted).then(() => {
                expect(showSnackbarMessageSpy).toHaveBeenCalledWith(expectedMessage.title + ' ' + expectedMessage.body);
            }, fail);

            const req = httpMock.expectOne(BASE_URL + 'drawings/' + drawingToBeDeleted._id);
            expect(req.request.method).toBe('DELETE');
            // actually send the request
            req.flush(expectedMessage);
        });

        it('should handle exceptions', () => {
            const drawingToBeDeleted = { _id: 'abc' } as Drawing;
            const showSnackbarMessageSpy = spyOn<any>(service, 'showSnackbarMessage').and.callThrough();
            service.deleteDrawing(drawingToBeDeleted).then(() => {
                expect(showSnackbarMessageSpy).toHaveBeenCalledWith('Hello');
            }, fail);

            const req = httpMock.expectOne(BASE_URL + 'drawings/' + drawingToBeDeleted._id);
            expect(req.request.method).toBe('DELETE');
            // actually send the request
            req.error(new ErrorEvent('Hello'));
        });
    });
});
