import { TestBed } from '@angular/core/testing';
import { AlbumRequestService } from './album-request.service';

describe('AlbumRequestService', () => {
    let service: AlbumRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AlbumRequestService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
