import { TestBed } from '@angular/core/testing';

import { ProxyMonitoringService } from './proxy-monitoring.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProxyMonitoringService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ]
  }));

  it('should be created', () => {
    const service: ProxyMonitoringService = TestBed.get(ProxyMonitoringService);
    expect(service).toBeTruthy();
  });
});
