import { TestBed } from '@angular/core/testing';

import { ChatCommunicatioService } from './chat-communicatio-service.service';

describe('ChatCommunicatioService', () => {
  let service: ChatCommunicatioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatCommunicatioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
