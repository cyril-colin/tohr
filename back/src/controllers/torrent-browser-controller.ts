import * as express from 'express';
import { TorrentBrowserService, BrowserSearch } from '../services/torrent-browser.service';
import { TransmissionDaemonService } from '../services/transmission-daemon.service';
import { Environment } from '../environment';
import { BrowserTorrent } from '../core/torrent.model';
import { HttpBadRequest, HttpTorrentSearchError, HttpTransmissionError } from '../core/errors';


export class TorrentBrowserController {
  constructor(
    private ts: TorrentBrowserService,
    private transmissionDaemonService: TransmissionDaemonService,
    private env: Environment,
  ) { }

  async search(request: express.Request, response: express.Response, next): Promise<any> {
    const params: BrowserSearch = request.query as unknown as BrowserSearch;
    if (!params.search || typeof(params.search) !== 'string' || params.search.length > 50) {
      return next(new HttpBadRequest('invalid-search'));
    }

    if (!params.category || typeof(params.category) !== 'string' && (params.category as string).length > 50) {
      return next(new HttpBadRequest('invalid-category'));
    }

    if (params.limit && isNaN(params.limit)) {
      return next(new HttpBadRequest('invalid-limit'));
    }

    const torrents = await this.ts.search(params).catch(err => {
      const error = new HttpTorrentSearchError(err);
      const scraperErrorsType = ['CloudflareError', 'ParserError', 'CaptchaError' ];
      if (scraperErrorsType.includes(err.constructor.name)) {
       error.businessCode = 'cloudflare-error'
      }

      return next(error);
    });

    return response.send(torrents);
  }

  async add(request: express.Request, response: express.Response, next): Promise<any> {
    const params: BrowserTorrent = request.body;
    if (!params) {
      return next(new HttpBadRequest('invalid-given-torrent'));
    }

    const isKnownDestination = this.env.monitoring.destinations.find(d => d.path === params.destination.path);
    if (!params.destination || !isKnownDestination) {
      return next(new HttpBadRequest('invalid-destination'));
    }

    if (!params.link || 10 > params.link.length || params.link.length > 150 ) {
      return next(new HttpBadRequest('invalid-download-link'));
    }

    const torrentPath = '/tmp/' + Math.random().toString(36).substring(7)+'.torrent';
    await this.ts.downloadTorrent(params, torrentPath).catch((err: any) => new HttpTorrentSearchError(err));
    const uploadResult = await this.transmissionDaemonService.addTorrentFile(torrentPath, params.destination.path).catch(err => new HttpTransmissionError(err));
    return response.json(uploadResult);
  }
}
