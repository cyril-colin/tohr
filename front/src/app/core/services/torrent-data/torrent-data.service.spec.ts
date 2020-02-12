import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TorrentDataService } from './torrent-data.service';

describe('TorrentDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ]
  }));

  it('should be created', () => {
    const service: TorrentDataService = TestBed.inject(TorrentDataService);
    expect(service).toBeTruthy();
  });
});
