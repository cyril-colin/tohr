import { TestBed } from '@angular/core/testing';

import { CurrentUserService } from './current-user.service';

describe('CurrentUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CurrentUserService = TestBed.inject(CurrentUserService);
    expect(service).toBeTruthy();
  });
});
