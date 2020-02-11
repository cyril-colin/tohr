import * as express from 'express';
import { Torrent } from '../core//torrent.model';
import { TorrentDestination } from '../core/monitoring/torrent-destination.model';
import { TransmissionDaemonService } from '../services/transmission-daemon.service';
import { LoggerService } from '../services/logger.service';
import { Environment } from '../environment';

export interface ApiError {
  message: string;
}

export class TorrentController {
  constructor(
    private transmissionDaemonService: TransmissionDaemonService,
    private loggerService: LoggerService,
    private env: Environment,
  ) { }

  getAll(request: express.Request, response: express.Response): Promise<any> {
    const tdRequest = this.transmissionDaemonService.get();
    tdRequest.then(data => {
      const destinationsList: TorrentDestination[] = this.env.monitoring.destinations;
      data.arguments.torrents.forEach((t: Torrent) => {
        t.destination = destinationsList.find(d => d.path === t.downloadDir);
      });

      response.send(data);
    });

    tdRequest.catch(err => this.throwError500(response, err));
    return tdRequest;
  }

  get(request: express.Request, response: express.Response): Promise<any> {
    if (isNaN(request.params.id as any)) {
      return this.throwError400('Not a number.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.get([+request.params.id]);
    tdRequest.then(data => {
      const destinationsList: TorrentDestination[] = this.env.monitoring.destinations;
      data.arguments.torrents.forEach((t: Torrent) => {
        t.destination = destinationsList.find(d => d.path === t.downloadDir);
      });

      response.send(data);
    });

    tdRequest.catch(err => this.throwError500(response, err));

    return tdRequest;
  }

  add(request: express.Request, response: express.Response): Promise<any> {
    if (!request.body.downloadDir) {
      return this.throwError400('Missing downloadDir.', response, request.query, request.params);
    }

    if (!request.body.metainfo) {
      return this.throwError400('Missing metainfo.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.add(request.body.downloadDir, request.body.metainfo);
    tdRequest.then(data => response.send(data));
    tdRequest.catch(err => this.throwError500(response, err));
    return tdRequest;
  }

  remove(request: express.Request, response: express.Response): Promise<any> {
    if (!request.params.id) {
      return this.throwError400('Missing id.', response, request.query, request.params);
    }

    if (!request.query.deleteLocalData) {
      return this.throwError400('Missing deleteLocalData.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.remove(request.params.id, request.query.deleteLocalData);
    tdRequest.then(data => response.send(data));
    tdRequest.catch(err => this.throwError500(response, err));
    return tdRequest;
  }


  move(request: express.Request, response: express.Response): Promise<any> {
    if (isNaN(request.params.id as any)) {
      return this.throwError400('Not a number.', response, request.query, request.params);
    }

    const selectedDestination = this.env.monitoring.destinations.find(d => d.name === request.body.destinationName);
    if (!selectedDestination) {
      return this.throwError400('Not a valid destination.', response, request.query, request.params);
    }

    const tdRequest = this.transmissionDaemonService.move(request.params.id as any, selectedDestination.path);
    tdRequest.then(data => {
      response.send(data);
    });
    tdRequest.catch(err => this.throwError500(response, err));

    return tdRequest;
  }

  private throwError500(response: express.Response, err: any) {
    this.loggerService.error(err);
    response.status(500).send({ message: 'Internal Error' } as ApiError);
  }

  private throwError400(message: string, response: express.Response, ...extraLog: any[]): Promise<any> {
    this.loggerService.error(message, extraLog);
    response.status(400).send({ message } as ApiError);
    return null;
  }
}
