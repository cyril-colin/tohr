import { TestBed, async, inject } from '@angular/core/testing';

import { AlreadyLoggedinGuard } from './already-loggedin.guard';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AlreadyLoggedinGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlreadyLoggedinGuard],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ]
    });
  });

  it('should ...', inject([AlreadyLoggedinGuard], (guard: AlreadyLoggedinGuard) => {
    expect(guard).toBeTruthy();
  }));
});
