/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UserAuthentificationService } from './user-authentification.service';

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
