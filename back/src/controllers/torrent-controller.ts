import * as express from 'express';
import * as fs from 'fs';
import { Torrent } from '../core//torrent.model';
import { TorrentDestination } from '../core/monitoring/torrent-destination.model';
import { TransmissionDaemonService } from '../services/transmission-daemon.service';
import { Environment } from '../environment';
import { HttpErrorService, ApiError } from '../services/http-error.service';
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
        t.statusStr = this.transmissionDaemonService.getStatus(t.status).trim().toLocaleUpperCase();
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

    const fields = ['id', 'name', 'totalSize', 'downloadDir', 'percentDone', 'rateDownload', 'rateUpload', 'error', 'errorString', 'status', 'trackers', 'addedDate', 'files'];
    const tdRequest = this.transmissionDaemonService.get([+request.params.id], fields);
    tdRequest.then(data => {
      const destinationsList: TorrentDestination[] = this.env.monitoring.destinations;
      data.arguments.torrents.forEach((t: Torrent) => {
        t.destination = destinationsList.find(d => d.path === t.downloadDir);
        t.statusStr = this.transmissionDaemonService.getStatus(t.status).trim().toLocaleUpperCase();
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

    const deleteDataPresent = request.query.deleteLocalData && (request.query.deleteLocalData === 'true'|| request.query.deleteLocalData === 'false' );
    if (!deleteDataPresent) {
      return this.httpErrorService.error400('Missing deleteLocalData.', response, request.query, request.params);
    }

    const deleteDataBoolean = request.query.deleteLocalData === 'true';
    const tdRequest = this.transmissionDaemonService.remove(request.params.id, deleteDataBoolean);
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

  stop(request: express.Request, response: express.Response): Promise<any> {
    if (isNaN(request.params.id as any)) {
      return this.httpErrorService.error400('Not a number.', response, request.query, request.params);
    }
    const tdRequest = this.transmissionDaemonService.stop(request.params.id as any);
    tdRequest.then(data => {
      response.send(data);
    });
    tdRequest.catch(err => this.httpErrorService.error500(response, err));

    return tdRequest;
  }

  start(request: express.Request, response: express.Response): Promise<any> {
    if (isNaN(request.params.id as any)) {
      return this.httpErrorService.error400('Not a number.', response, request.query, request.params);
    }
    const tdRequest = this.transmissionDaemonService.start(request.params.id as any);
    tdRequest.then(data => {
      response.send(data);
    });
    tdRequest.catch(err => this.httpErrorService.error500(response, err));

    return tdRequest;
  }

  download(request: express.Request, response: express.Response): Promise<any>  {
    if (isNaN(request.params.id as any)) {
      return this.httpErrorService.error400('Not a number.', response, request.query, request.params);
    }

    const query: any = request.query;
    if (!request.query.filename || query.filename.includes('../')) {
      return this.httpErrorService.error400('Not a valid filename.', response, request.query, request.params);
    }

    const filename = decodeURI(query.filename).replace(/\"/g, '');

    const res = this.transmissionDaemonService.get([+request.params.id], ['name', 'files', 'downloadDir'])
    .then((data: {arguments: {torrents: Torrent[]}}) => {
      const file = data.arguments.torrents[0].files.find(f => f.name.trim() === filename.trim());
      const path = data.arguments.torrents[0].downloadDir + '/'+file.name;
      const stat = fs.statSync(path);
      const rs = fs.createReadStream(path);
      response.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-disposition': 'attachment; filename='+file.name,
        'Content-Length': stat.size,
      });
      rs.pipe(response);
    })
    .catch(err => {
      this.logger.error('Error getting torrent', err);
      response.status(500).send({ message: 'Error getting torrent '+request.params.id } as ApiError)
    });

    return res;

  }

}
