import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { BrowserTorrent } from 'src/app/core/model/torrent';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';

export interface SearchData {
  searchValue: string;
  destination: TorrentDestination;
}

@Injectable({
  providedIn: 'root'
})
export class ProxyBrowserService {

  endpoint = '/api';
  constructor(private http: HttpClient) { }


  search(data: SearchData): Observable<BrowserTorrent[]> {
    const params = new HttpParams({
      fromObject: {
        search: encodeURI(data.searchValue),
        category: data.destination.category,
      }
    });
    const mock: BrowserTorrent[] = [
      {
        title: 'Vikings.S05.FRENCH.1080p.AMZN.WEB-DL.DD5.1.H264-FRATERNiTY ',
        time: new Date(),
        seeds: 100,
        peers: 200,
        size: 1024,
        desc: 'une description',
        id: '1qsdqs321sdqf',
        provider: 'YggTorrent',
        link: {
          path: '',
          file: '',
        },
        computedData: {
          tags: [{color: 'red', name: 'HDTV'}],
          title: 'Vikings.S05.FRENCH.1080p.AMZN.WEB-DL.DD5.1.H264-FRATERNiTY',
        },
      }
    ];
    // return of(mock);
    return  this.http.get<BrowserTorrent[]>(this.endpoint + '/browser/search', {params});
  }

  add(torrent: BrowserTorrent, destination: TorrentDestination): Observable<any> {
    const params = {
      provider: torrent.provider,
      link: torrent.link,
      destination
    }

    return this.http.post<any>(this.endpoint + '/browser/add', params);
  }

}
