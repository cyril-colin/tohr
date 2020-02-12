import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { Torrent, TorrentPost } from 'src/app/core/model/torrent';
import { ProxyTorrentService } from '../proxy/proxy-torrent/proxy-torrent.service';
import { switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TorrentDataService {
  private torrentsSubject: BehaviorSubject<Torrent[]> = new BehaviorSubject([]);
  public readonly torrents$: Observable<Torrent[]> = this.torrentsSubject.asObservable();

  constructor(private proxyTorrentService: ProxyTorrentService) {
    this.loadInitialData();
  }

  loadInitialData(): Observable<Torrent[]> {
    return this.proxyTorrentService.getAllTorrent().pipe(tap(torrents => this.torrentsSubject.next(torrents)));
  }

  addTorrent(torrent: TorrentPost): Observable<Torrent[]> {
    const obs = this.proxyTorrentService.addTorrents(torrent).pipe(
      switchMap(_ => this.loadInitialData()),
    );

    return obs;
  }

  addMultipleTorrents(torrents: TorrentPost[]): Observable<Torrent[]> {
    const requests = [];
    torrents.forEach(t => requests.push(this.proxyTorrentService.addTorrents(t)));

    return forkJoin<Torrent>(requests);
  }

  deleteTorrent(torrentToDelete: number, withData: boolean): Observable<Torrent[]> {
    const obs = this.proxyTorrentService.deleteTorrent(torrentToDelete, withData).pipe(
      switchMap(_ => this.loadInitialData()),
    );

    return obs;
  }
}
