import { TestBed } from '@angular/core/testing';

import { ProxyAuthentService } from './proxy-authent.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProxyAuthentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ]
  }));

  it('should be created', () => {
    const service: ProxyAuthentService = TestBed.get(ProxyAuthentService);
    expect(service).toBeTruthy();
  });
});
