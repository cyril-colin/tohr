import { TestBed, async, inject } from '@angular/core/testing';

import { IsAuthorizedGuard } from './is-authorized.guard';
import { RouterTestingModule } from '@angular/router/testing';

describe('IsAuthorizedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IsAuthorizedGuard],
      imports: [
        RouterTestingModule
      ]
    });
  });

  it('should ...', inject([IsAuthorizedGuard], (guard: IsAuthorizedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
