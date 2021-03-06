import * as express from 'express';
import { Environment } from '../environment';
import { HttpBadRequest, HttpTorrentSearchError, HttpTransmissionError } from '../core/errors';
import { JackettMapper } from '../mappers/jackett.mapper';
import fs from 'fs';
import { JackettClient } from '../clients/jacket-client/jackett-client';
import { TransmissionDaemonClient } from '../clients/transmission-daemon-client/transmission-daemon-client';
import { TorrentBrowser } from '../core/public-models/torrent-browser';
import { TorrentDestination } from '@src/core/public-models/torrent-destination';


export class TorrentBrowserController {
  constructor(
    private jackettClientService: JackettClient,
    private tdClient: TransmissionDaemonClient,
    private dest: TorrentDestination[],
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

    const existingCategory = this.dest.find(d => d.category === params.category);
    if (params.category && !existingCategory) {
      return next(new HttpBadRequest('invalid-category'));
    }

    const torrents = await this.jackettClientService.search({query: params.search, categories: [params.category]})
    .then(res => res.map(t => JackettMapper.toFrontResult(t)))

    return response.json(torrents);
  }

  /**
   * This method will ask jackett to return the torrent file into a
   * tmp directory.
   *
   * Then, we add it to transmission daemon in order to start downloading
   * data.
   */
  async add(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    const params: TorrentBrowser = request.body;
    if (!params) {
      return next(new HttpBadRequest('invalid-given-torrent'));
    }

    const isKnownDestination = this.dest.find(d => d.path === params.destination.path);
    if (!params.destination || !isKnownDestination) {
      return next(new HttpBadRequest('invalid-destination'));
    }

    if (!params.link || !params.link.file || !params.link.path ) {
      return next(new HttpBadRequest('invalid-download-link'));
    }

    const torrentPath = '/tmp/' + Math.random().toString(36).substring(7)+'.torrent';
    const downloadResult = await this.jackettClientService.download(params.link).catch((err: any) => new HttpTorrentSearchError(err));
    await fs.promises.writeFile(torrentPath, downloadResult.data);
    const uploadResult = await this.tdClient.addTorrentFile(torrentPath, params.destination.path).catch(err => new HttpTransmissionError(err));
    return response.json(uploadResult);
  }
}
