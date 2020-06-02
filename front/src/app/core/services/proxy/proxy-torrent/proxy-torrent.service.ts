import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Torrent, TorrentPost } from 'src/app/core/model/torrent';
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
    return  this.http.get<Torrent[]>(this.endpoint + '/torrents').pipe(
      map(torrents => torrents.sort((a, b) => (b.addedDate - a.addedDate))),
    );
  }

  getTorrent(id: number): Observable<Torrent> {
    return this.http.get<Torrent>(this.endpoint + '/torrents/' + id);
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

  start(id: number) {
    return  this.http.put<void>(this.endpoint + '/torrents/' + id + '/start', {});
  }
  stop(id: number) {
    return  this.http.put<void>(this.endpoint + '/torrents/' + id + '/stop', {});
  }

  download(id: number, filename: string) {
    const params = new HttpParams({
      fromObject: {
        filename: JSON.stringify(filename),
      }
    });
    return  this.http.get(this.endpoint + '/torrents/' + id + '/download', {
      params,
      responseType: 'blob'
    });
  }
}
