import * as express from 'express';
import { SystemInformationService } from '../services/system-information.service';
import { LoggerService } from '../services/logger.service';
import { CurrentProcessInfo } from '../core/monitoring/current-process-info.model';
import { Environment } from '../environment';

export class MonitoringController {
  constructor(
    private env: Environment,
    private systemInformationService: SystemInformationService,
    private loggerService: LoggerService,

  ) { }

  getProcessInformations(request: express.Request, response: express.Response): Promise<any> {
    const info = new CurrentProcessInfo();
    info.processUser = this.systemInformationService.getProcessUser();
    const errors: any[] = [];
    const promises: Promise<any>[] = [
      this.systemInformationService.getCpuUsage()
            .then(cpuUsage => info.cpuUsage = +cpuUsage)
            .catch(err => errors.push(err)),
      this.systemInformationService.getMemoryUsage()
            .then(memoryUsage => info.memoryUsage = +memoryUsage)
            .catch(err => errors.push(err)),
    ];

    return Promise.all(promises).then(status => {
      if (errors.length > 0) {
        this.loggerService.warn('Error list :', errors);
        response.status(500).send('error getting information');
      }

      if (errors.length === 0) {
        response.status(200).send(info);
      }
    })
    .catch(err => {
      this.loggerService.error('Errors catched by Promise.all()', err);
      this.loggerService.error('Error list :', errors);
      response.status(500).send('error getting information');
    });
  }

  getTorrentDestinations(request: express.Request, response: express.Response): Promise<any> {
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


    return Promise.all(promises).then(_ => {
      response.send(this.env.monitoring.destinations);
    }).catch(err => {
      console.warn(errors);
      response.status(500).send(this.env.monitoring.destinations);
    });
  }



  diskUsage(request: express.Request, response: express.Response): Promise<any> {
    const toKeep = this.env.monitoring.diskToWatch;
    const status = this.systemInformationService.getDiskStatus();
    status.then(ds => {
      response.send(ds.filter(d => toKeep.includes(d.fileSystem)));
    });

    status.catch(err => {
      console.error(err);
      response.sendStatus(500);
    });

    return status;
  }

  getExternalLinks(request: express.Request, response: express.Response): Promise<any> {
    const externalLinks = this.env.externalLinks;

    return Promise.resolve(externalLinks).then( res => response.send(res));
  }

  getLogs(request: express.Request, response: express.Response): void {
    const file = this.env.logFile;
    const path = file.startsWith('/') ? file : this.systemInformationService.getRootDir() + file;
    response.download(path);
  }
}
