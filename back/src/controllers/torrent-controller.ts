import * as express from 'express';
import * as fs from 'fs';
import { HttpBadRequest, HttpTransmissionError } from '@src/core/errors';
import { TransmissionDaemonClient } from '@src/clients/transmission-daemon-client/transmission-daemon-client';
import { TransmissionDaemonMapper } from '@src/mappers/transmission-daemon.mapper';
import { TDTorrent } from '@src/clients/transmission-daemon-client/models/tdtorrent';
import { TorrentDestination } from '@src/core/public-models/torrent-destination';

export class TorrentController {
  constructor(
    private tdClient: TransmissionDaemonClient,
    private tdMapper: TransmissionDaemonMapper,
    private dest: TorrentDestination[],
  ) { }

  async getAll(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    const torrents = await this.tdClient.get()
      .then(tor => tor.map(t => this.tdMapper.toFrontTorrent(t)))
      .catch(err => next(new HttpTransmissionError(err)));

    return response.json(torrents);
  }

  async get(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    if (isNaN(request.params.id as any)) {
      return next(new HttpBadRequest('invalid-id'));
    }

    const data = await this.tdClient.get([+request.params.id], TransmissionDaemonClient.DETAIL_FIELDS)
      .then(tor => tor.map(t => this.tdMapper.toFrontTorrent(t))[0])
      .catch(err => next(new HttpTransmissionError(err)));

    return response.json(data);
  }

  async add(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    if (!request.body.downloadDir) {
      return next(new HttpBadRequest('invalid-download-dir'));
    }

    if (!request.body.metainfo) {
      return next(new HttpBadRequest('invalid-metainfo'));
    }

    const data = await this.tdClient.add(request.body.downloadDir, request.body.metainfo)
    .catch(err => next(new HttpTransmissionError(err)));
    return response.json(data);
  }

  async remove(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    if (!request.params.id) {
      return next(new HttpBadRequest('invalid-id'));
    }

    const deleteDataPresent = request.query.deleteLocalData && (request.query.deleteLocalData === 'true'|| request.query.deleteLocalData === 'false' );
    if (!deleteDataPresent) {
      return next(new HttpBadRequest('invalid-destination'));
    }

    const deleteDataBoolean = request.query.deleteLocalData === 'true';
    const data = await this.tdClient.remove(request.params.id, deleteDataBoolean)
    .catch(err => next(new HttpTransmissionError(err)));
    return response.json(data);
  }


  async move(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    if (!request.params.id || isNaN(request.params.id as any)) {
      return next(new HttpBadRequest('invalid-id'));
    }

    const selectedDestination = this.dest.find(d => d.name === request.body.destinationName);
    if (!selectedDestination) {
      return next(new HttpBadRequest('invalid-destination'));
    }

    const data = await this.tdClient.move(request.params.id as any, selectedDestination.path)
    .catch(err => next(new HttpTransmissionError(err)));

    return response.json(data);
  }

  async stop(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    if (!request.params.id || isNaN(request.params.id as any)) {
      return next(new HttpBadRequest('invalid-id'));
    }

    const data = await this.tdClient.stop(request.params.id as any)
    .catch(err => next(new HttpTransmissionError(err)));

    return response.json(data);
  }

  async start(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    if (!request.params.id || isNaN(request.params.id as any)) {
      return next(new HttpBadRequest('invalid-id'));
    }
    const data = await this.tdClient.start(request.params.id as any)
    .catch(err => next(new HttpTransmissionError(err)));

    return response.json(data);
  }

  async download(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any>  {
    if (!request.params.id || isNaN(request.params.id as any)) {
      return next(new HttpBadRequest('invalid-id'));
    }

    const query: any = request.query;
    if (!request.query.filename || query.filename.includes('../')) {
      return next(new HttpBadRequest('invalid-filename'));
    }

    const filename = decodeURI(query.filename).replace(/\"/g, '');
    const torrents: TDTorrent | any = await this.tdClient.get([+request.params.id], ['name', 'files', 'downloadDir']).then((t: TDTorrent[]) => t[0])
    .catch(err => next(new HttpTransmissionError(err)));

    const file = torrents[0].files.find((f: any) => f.name.trim() === filename.trim());
    const path = torrents[0].downloadDir + '/'+file.name;
    const stat = fs.statSync(path);
    const rs = fs.createReadStream(path);
    response.writeHead(200, {
      'Content-Type': 'application/octet-stream',
      'Content-disposition': 'attachment; filename='+file.name,
      'Content-Length': stat.size,
    });


    return rs.pipe(response);
  }

}
