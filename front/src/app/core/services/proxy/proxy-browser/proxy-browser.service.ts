import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
