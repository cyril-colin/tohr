import * as express from 'express';
import { TorrentBrowserService, BrowserSearch } from '../services/torrent-browser.service';
import { TransmissionDaemonService } from '../services/transmission-daemon.service';
import { Environment } from '../environment';
import { TorrentDestination } from '../core/monitoring/torrent-destination.model';
import { HttpErrorService } from '../services/http-error.service';


export class TorrentBrowserController {
  constructor(
    private ts: TorrentBrowserService,
    private transmissionDaemonService: TransmissionDaemonService,
    private env: Environment,
    private httpErrorService: HttpErrorService,
  ) { }

  search(request: express.Request, response: express.Response): Promise<any> {
    const params: BrowserSearch = request.query;
    if (!params.search || typeof(params.search) !== 'string' || params.search.length > 50) {
      return this.httpErrorService.error400('Search must be string with a maximum of 50 characters.', response);
    }

    if (!params.category || typeof(params.category) !== 'string' && (params.category as string).length > 50) {
      return this.httpErrorService.error400('Category must be string with a maximum of 50 characters.', response);
    }

    if (params.limit && isNaN(params.limit)) {
      return this.httpErrorService.error400('Limit must be a number.', response);
    }

    return this.ts.search(params)
          .then(torrents => response.send(torrents))
          .catch(err => this.httpErrorService.error500(response, err));
  }

  add(request: express.Request, response: express.Response): Promise<void | express.Response> {
    const params: {provider: string; link: string; destination: TorrentDestination} = request.body;
    if (!params) {
      return this.httpErrorService.error400('No given torrent.', response);
    }

    const isKnownDestination = this.env.monitoring.destinations.find(d => d.path === params.destination.path);
    if (!params.destination || !isKnownDestination) {
      return this.httpErrorService.error400('Destination not known.', response);
    }

    if (!params.link || 10 > params.link.length || params.link.length > 150 ) {
      return this.httpErrorService.error400('Download link not correct', response);
    }


    const torrentPath = '/tmp/' + Math.random().toString(36).substring(7)+'.torrent';
    return this.ts.downloadTorrent(params, torrentPath)
          .then(buffer => {
            this.transmissionDaemonService.addTorrentFile(torrentPath, params.destination.path).then(upload => {
              return response.send(upload);
            }).catch(err => this.httpErrorService.error500(response, err));
          }).catch(err => {
            console.error(err);
            return this.httpErrorService.error500(response, err);
          });
  }
}
