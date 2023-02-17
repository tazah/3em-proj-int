import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, waitForAsync as  } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { UploadImgurService } from './upload-imgur.service';
// tslint:disable: no-any
interface ImgurResponse {
    data: { id: string; link: string };
}
// tslint:disable: no-string-literal
describe('UploadImageService', () => {
    let httpMock: HttpTestingController;
    let service: UploadImgurService;
    let snakeBarMock: any;

    beforeEach(waitForAsync(async () => {
        const actionFuncReturn = {
            subscribe: (f: () => Observable<void>) => {
                f();
            },
        };

        snakeBarMock = { open: () => ({ onAction: () => actionFuncReturn }) };
        TestBed.configureTestingModule({
            providers: [{ provide: MatSnackBar, useValue: snakeBarMock }],
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(UploadImgurService);
        httpMock = TestBed.inject(HttpTestingController);
    }));

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('showSnakeBarMessage should open snakeBar ', () => {
        const testResponse: ImgurResponse = { data: { id: 'testID', link: 'linkTest' } };
        service['showSnackbarMessage']('Image Téléversée', testResponse);

        expect(snakeBarMock).toBeDefined();
    });

    describe('uploadImage()', () => {
        it('should call showSnakeBarMessage', () => {
            const imageFile: Blob = new Blob();
            const expectedMessage: ImgurResponse = { data: { id: '1', link: 'link' } };

            const spy = spyOn<any>(service, 'showSnackbarMessage');

            service.uploadImage(imageFile).then(() => {
                expect(spy).toHaveBeenCalledWith('Lien sur Imgur : imgur.com/' + expectedMessage.data.id, expectedMessage);
            }, fail);

            const req = httpMock.expectOne(service['url']);
            expect(req.request.method).toBe('POST');
            // actually send the request
            req.flush(expectedMessage);
        });

        it('should handle exceptions', () => {
            const imageFile: Blob = new Blob();

            const spy = spyOn<any>(service, 'showSnackbarMessage');
            service.uploadImage(imageFile).then(() => {
                expect(spy).toHaveBeenCalled();
            }, fail);

            const req = httpMock.expectOne(service['url']);
            expect(req.request.method).toBe('POST');
            // actually send the request
            req.error(new ErrorEvent('Hello'));
        });
    });
});
