import { TestBed } from '@angular/core/testing';

import { ProxyBrowserService } from './proxy-browser.service';

describe('ProxyBrowserService', () => {
  let service: ProxyBrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProxyBrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
