import * as express from 'express';
import { Torrent } from '../core//torrent.model';
import { TorrentDestination } from '../core/monitoring/torrent-destination.model';
import { TransmissionDaemonService } from '../services/transmission-daemon.service';
import { Environment } from '../environment';
import { HttpErrorService } from '../services/http-error.service';
import { LoggerService } from '../services/logger.service';

export class TorrentController {
  constructor(
    private transmissionDaemonService: TransmissionDaemonService,
    private env: Environment,
    private httpErrorService: HttpErrorService,
    private logger: LoggerService,
  ) { }

  getAll(request: any, response: express.Response): Promise<any> {
    const tdRequest = this.transmissionDaemonService.get();
    tdRequest.then(data => {
      const destinationsList: TorrentDestination[] = this.env.monitoring.destinations;
      data.arguments.torrents.forEach((t: Torrent) => {
        t.destination = destinationsList.find(d => d.path === t.downloadDir);
      });

      response.send(data);
    });

    tdRequest.catch(err => this.httpErrorService.error500(response, err));
    return tdRequest;
  }

  get(request: express.Request, response: express.Response): Promise<any> {
    if (isNaN(request.params.id as any)) {
      return this.httpErrorService.error400('Not a number.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.get([+request.params.id]);
    tdRequest.then(data => {
      const destinationsList: TorrentDestination[] = this.env.monitoring.destinations;
      data.arguments.torrents.forEach((t: Torrent) => {
        t.destination = destinationsList.find(d => d.path === t.downloadDir);
      });

      response.send(data);
    });

    tdRequest.catch(err => this.httpErrorService.error500(response, err));

    return tdRequest;
  }

  add(request: express.Request, response: express.Response): Promise<any> {
    if (!request.body.downloadDir) {
      return this.httpErrorService.error400('Missing downloadDir.', response, request.query, request.params);
    }

    if (!request.body.metainfo) {
      return this.httpErrorService.error400('Missing metainfo.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.add(request.body.downloadDir, request.body.metainfo);
    tdRequest.then(data => response.send(data));
    tdRequest.catch(err => this.httpErrorService.error500(response, err));
    return tdRequest;
  }

  remove(request: express.Request, response: express.Response): Promise<any> {
    if (!request.params.id) {
      return this.httpErrorService.error400('Missing id.', response, request.query, request.params);
    }

    if (!request.query.deleteLocalData) {
      return this.httpErrorService.error400('Missing deleteLocalData.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.remove(request.params.id, request.query.deleteLocalData);
    tdRequest.then(data => response.send(data));
    tdRequest.catch(err => this.httpErrorService.error500(response, err));
    return tdRequest;
  }


  move(request: express.Request, response: express.Response): Promise<any> {
    if (isNaN(request.params.id as any)) {
      return this.httpErrorService.error400('Not a number.', response, request.query, request.params);
    }

    const selectedDestination = this.env.monitoring.destinations.find(d => d.name === request.body.destinationName);
    if (!selectedDestination) {
      return this.httpErrorService.error400('Not a valid destination.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.move(request.params.id as any, selectedDestination.path);
    tdRequest.then(data => {
      response.send(data);
    });
    tdRequest.catch(err => this.httpErrorService.error500(response, err));

    return tdRequest;
  }

}
