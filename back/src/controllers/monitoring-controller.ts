import * as express from 'express';
import { SystemInformationService } from '../services/system-information.service';
import { Environment } from '../environment';
import { HttpInternalError } from '../core/errors';
import {CurrentProcessInfo} from '../core/public-models/current-process-info';
import {DiskStatus} from '../core/public-models/disk-status';

export class MonitoringController {
  constructor(
    private env: Environment,
    private systemInformationService: SystemInformationService,
  ) { }

  async getProcessInformations(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    const info = new CurrentProcessInfo();
    info.processUser = this.systemInformationService.getProcessUser();
    const errors: Error[] = [];
    const promises: Promise<any>[] = [
      this.systemInformationService.getCpuUsage()
            .then(cpuUsage => info.cpuUsage = +cpuUsage)
            .catch(err => errors.push(err)),
      this.systemInformationService.getMemoryUsage()
            .then(memoryUsage => info.memoryUsage = +memoryUsage)
            .catch(err => errors.push(err)),
    ];

    await Promise.all(promises).catch(err => {
      return next(new HttpInternalError('getting-process-info-failed', err));
    });

    if (errors.length > 0) {
      return next(new HttpInternalError('getting-process-info-failed', errors));
    }

    return response.json(info);
    ;
  }

  async getTorrentDestinations(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    const torrentDestinations = this.env.monitoring.destinations;
    const promises: Promise<string>[] = [];
    const errors: any[] = [];
    torrentDestinations.forEach(td => {
      const p = this.systemInformationService.getDestinationRight(td).then(rights => {
        return td.rights = rights;
      }).catch(err => {
        errors.push({path: td.rights, err});
        return td.rights = err;
      });
      promises.push(p);
    });


    await Promise.all(promises).catch(err => {
      return next(new HttpInternalError('getting-destinations-failed', err));
    });

    if (errors.length > 0) {
      return next(new HttpInternalError('getting-process-info-failed', errors));
    }

    return response.json(this.env.monitoring.destinations);
  }



  async diskUsage(request: express.Request, response: express.Response, next: express.NextFunction): Promise<any> {
    const toKeep = this.env.monitoring.diskToWatch;
    const status = await this.systemInformationService.getDiskStatus().catch(err => new HttpInternalError('disk-status-failed', err));
    return response.json((status as DiskStatus[]).filter(d => toKeep.includes(d.fileSystem)));
  }

  async getLogs(request: express.Request, response: express.Response, next: express.NextFunction) {
    const file = this.env.logFile;
    const path = file.startsWith('/') ? file : this.systemInformationService.getRootDir() + file;
    return response.download(path);
  }
}
