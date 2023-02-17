import { TestBed } from '@angular/core/testing';
import { ChatRequestService } from './chat-request.service';

describe('ChatRequestService', () => {
    let service: ChatRequestService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ChatRequestService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
