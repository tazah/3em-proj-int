/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync as  } from '@angular/core/testing';
import { ChatCommunicationService } from './chat-communication.service';

describe('Service: ChatCommunication', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatCommunicationService]
    });
  });

  it('should ...', inject([ChatCommunicationService], (service: ChatCommunicationService) => {
    expect(service).toBeTruthy();
  }));
});
