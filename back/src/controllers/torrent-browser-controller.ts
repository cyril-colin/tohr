import * as express from 'express';
import { TransmissionDaemonService } from '../services/transmission-daemon.service';
import { Environment } from '../environment';
import { BrowserTorrent } from '../core/torrent.model';
import { HttpBadRequest, HttpTorrentSearchError, HttpTransmissionError } from '../core/errors';
import { JacketClientService } from '../services/jacket-client.service';
import { JackettMapper } from '../services/jackett.mapper';
import fs from 'fs';


export class TorrentBrowserController {
  constructor(
    private jackettClientService: JacketClientService,
    private transmissionDaemonService: TransmissionDaemonService,
    private env: Environment,
  ) { }

  /**
   * Ask Jackett to return a list of torrent matching
   * given parameters.
   */
  async search(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    const params: any = request.query;
    if (!params.search || typeof(params.search) !== 'string' || params.search.length > 50) {
      return next(new HttpBadRequest('invalid-search'));
    }

    const existingCategory = this.env.monitoring.destinations.find(d => d.category === params.category);
    if (params.category && !existingCategory) {
      return next(new HttpBadRequest('invalid-category'));
    }

    if (params.limit && isNaN(params.limit)) {
      return next(new HttpBadRequest('invalid-limit'));
    }
    const torrents = await this.jackettClientService.search({query: params.search, categories: [params.category]})
    .then(res => res.map(t => JackettMapper.toFrontResult(t)))

    return response.send(torrents);
  }

  /**
   * This method will ask jackett to return the torrent file into a
   * tmp directory.
   *
   * Then, we add it to transmission daemon in order to start downloading
   * data.
   */
  async add(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    const params: BrowserTorrent = request.body;
    if (!params) {
      return next(new HttpBadRequest('invalid-given-torrent'));
    }

    const isKnownDestination = this.env.monitoring.destinations.find(d => d.path === params.destination.path);
    if (!params.destination || !isKnownDestination) {
      return next(new HttpBadRequest('invalid-destination'));
    }

    if (!params.link || !params.link.file || !params.link.path ) {
      return next(new HttpBadRequest('invalid-download-link'));
    }

    const torrentPath = '/tmp/' + Math.random().toString(36).substring(7)+'.torrent';
    const downloadResult = await this.jackettClientService.download(params.link).catch((err: any) => new HttpTorrentSearchError(err));
    await fs.promises.writeFile(torrentPath, downloadResult.data);
    const uploadResult = await this.transmissionDaemonService.addTorrentFile(torrentPath, params.destination.path).catch(err => new HttpTransmissionError(err));
    return response.json(uploadResult);
  }
}
