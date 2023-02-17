/* tslint:disable:no-unused-variable */

import { TestBed, inject, waitForAsync as  } from '@angular/core/testing';
import { UserAuthentificationService } from './UserAuthentification.service';

describe('Service: UserAuthentification', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAuthentificationService]
    });
  });

  it('should ...', inject([UserAuthentificationService], (service: UserAuthentificationService) => {
    expect(service).toBeTruthy();
  }));
});
