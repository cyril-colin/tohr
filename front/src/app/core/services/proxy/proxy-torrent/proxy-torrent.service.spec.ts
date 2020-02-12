import { TestBed, inject } from '@angular/core/testing';

import { ProxyTorrentService } from './proxy-torrent.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { mockTorrents } from 'src/app/core/model/torrent';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';

describe('ProxyTorrentService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ]
  }));

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', () => {
    const service: ProxyTorrentService = TestBed.inject(ProxyTorrentService);
    expect(service).toBeTruthy();
  });

  it('should get all', inject([HttpTestingController, ProxyTorrentService],
    (httpMock: HttpTestingController, service: ProxyTorrentService) => {


      service.getAllTorrent().subscribe(data => {
        expect(data).toEqual(mockTorrents);
      });
      const req = httpMock.expectOne('/api/torrents');
      expect(req.request.method).toEqual('GET');
      req.flush({ data: { arguments: mockTorrents } });
    }));

  it('should get a Torrent', inject([HttpTestingController, ProxyTorrentService],
    (httpMock: HttpTestingController, service: ProxyTorrentService) => {


      service.getTorrent(1).subscribe(data => {
        expect(data.id).toBe(1);
        expect(data.name).toBe('Ubuntu');
      });
      const req = httpMock.expectOne('/api/torrents/1');
      expect(req.request.method).toEqual('GET');
      req.flush({ data: { arguments: mockTorrents[0] } });
    }));

  it('should add torrent', inject([HttpTestingController, ProxyTorrentService],
    (httpMock: HttpTestingController, service: ProxyTorrentService) => {


      service.addTorrents({ downloadDir: 'a/path', metainfo: 'sdqsdsqd' }).subscribe(data => {
        expect(data).toBeNull();
      });
      const req = httpMock.expectOne('/api/torrents');
      expect(req.request.method).toEqual('POST');
      req.flush(null);
    }));

  it('should delete torrent', inject([HttpTestingController, ProxyTorrentService],
    (httpMock: HttpTestingController, service: ProxyTorrentService) => {


      service.deleteTorrent(1, false).subscribe(data => {
        expect(data).toBeNull();
      });
      const req = httpMock.expectOne('/api/torrents/1?deleteLocalData=false');
      expect(req.request.method).toEqual('DELETE');
      req.flush(null);
    }));

  it('should move torrent', inject([HttpTestingController, ProxyTorrentService],
    (httpMock: HttpTestingController, service: ProxyTorrentService) => {

      const mockTorrentDestination: TorrentDestination = {
        default: false,
        description: 'descriptioon',
        icon: 'menu',
        name: 'mock',
        path: '/path',
        rights: 'rights',
      };


      service.move(1, mockTorrentDestination).subscribe(data => {
        expect(data).toBeNull();
      });
      const req = httpMock.expectOne('/api/torrents/1/move');
      expect(req.request.method).toEqual('PUT');
      req.flush(null);
    }));
});
