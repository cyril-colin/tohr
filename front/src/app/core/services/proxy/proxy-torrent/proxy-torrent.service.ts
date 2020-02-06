import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Torrent, TorrentPost, mockTorrents } from 'src/app/core/model/torrent';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RpcResponse } from 'src/app/core/model/rpc-response';
import { RpcTorrentList } from 'src/app/core/model/torrent-list';
import { map, tap } from 'rxjs/operators';
import { TorrentDestination } from 'src/app/core/model/torrent-destination';

@Injectable({
  providedIn: 'root'
})
export class ProxyTorrentService {
  endpoint = '/api';
  constructor(private http: HttpClient) { }


  getAllTorrent(): Observable<Torrent[]> {
    return  this.http.get<RpcResponse<RpcTorrentList>>(this.endpoint + '/torrents').pipe(map(res => res.arguments.torrents));
    // return  of(mockTorrents);
  }

  getTorrent(id: number): Observable<Torrent> {
    return this.http.get<RpcResponse<RpcTorrentList>>(this.endpoint + '/torrents/' + id).pipe(map(res => res.arguments.torrents[0]));
  }


  addTorrents(torrent: TorrentPost): Observable<void> {
    return  this.http.post<void>(this.endpoint + '/torrents', torrent);
  }


  deleteTorrent(id: number, withData: boolean): Observable<void> {
    const params = new HttpParams({
      fromObject: {
        deleteLocalData: JSON.stringify(withData),
      }
    });

    return  this.http.delete<void>(this.endpoint + '/torrents/' + JSON.stringify(id), {params});
  }

  move(id: number, destination: TorrentDestination): Observable<void> {
    return  this.http.put<void>(this.endpoint + '/torrents/' + id + '/move', {destinationName: destination.name});
  }
}
