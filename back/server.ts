import express from 'express';
import * as path from 'path';
import program from 'commander';
import jwtExpress from 'express-jwt';
import NodeCache from 'node-cache';
import { createLogger, transports, format } from 'winston';
import { TorrentController } from './src/controllers/torrent-controller';
import { LoginController } from './src/controllers/login-controller';
import { Environment } from './src/environment';
import { MonitoringController } from './src/controllers/monitoring-controller';
import { SystemInformationService } from './src/services/system-information.service';
import { LoggerService } from './src/services/logger.service';
import { TransmissionDaemonService } from './src/services/transmission-daemon.service';
import { TorrentBrowserService } from './src/services/torrent-browser.service';
import { TorrentBrowserController } from './src/controllers/torrent-browser-controller';
import TS from 'torrent-search-api';
import { HttpErrorService } from './src/services/http-error.service';
import { CurrentUserService } from './src/services/current-user.service';

program.option('-c, --config <config>', 'The configuration file', 'config.production.json');
program.parse(process.argv);

const config: Environment = require(__dirname + '/config/'+ program.config);
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `${info.timestamp} | ${info.level} | ${info.message}`)
  ),
  transports: [
    new transports.File({
      filename: config.logFile,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console(),
  ]
});

const app = express();


const loggerService = new LoggerService(logger);
const cache = new NodeCache();
const tdService = new TransmissionDaemonService(cache, config, loggerService);
const systemInformationService = new SystemInformationService();
const torrentBrowserService = new TorrentBrowserService(TS, config);
const httpErrorService = new HttpErrorService(loggerService);
const torrentController = new TorrentController(tdService, config, httpErrorService, loggerService);
const monitoringController = new MonitoringController(config, systemInformationService, loggerService);
const torrentBrowserController = new TorrentBrowserController(torrentBrowserService, tdService, config, httpErrorService, loggerService);
const currentUserService = new CurrentUserService();


app.use((req: any, res: any, next: any) => {
  loggerService.info(`${currentUserService.getUsername(req)} | ${req.method} ${req.url}`);
  next();
});

const API_PREFIX = '/api';
app.use(API_PREFIX, express.json({limit: '50mb'}));
app.post(API_PREFIX + '/login', (req: any, res: any) => (new LoginController(config)).login(req, res));
app.get(API_PREFIX + '/torrents', (req: any, res: any) => torrentController.getAll(req, res));
app.get(API_PREFIX + '/torrents/:id', (req: any, res: any) => torrentController.get(req, res));
app.put(API_PREFIX + '/torrents/:id/move', (req: any, res: any) => torrentController.move(req, res));
app.put(API_PREFIX + '/torrents/:id/start', (req: any, res: any) => torrentController.start(req, res));
app.put(API_PREFIX + '/torrents/:id/stop', (req: any, res: any) => torrentController.stop(req, res));
app.delete(API_PREFIX + '/torrents/:id', (req: any, res: any) =>  torrentController.remove(req, res));
app.post(API_PREFIX + '/torrents', (req: any, res: any) => torrentController.add(req, res));

app.get(API_PREFIX + '/monitoring/disk-usage', (req: any, res: any) => monitoringController.diskUsage(req, res));
app.get(API_PREFIX + '/monitoring/process-informations', (req: any, res: any) => monitoringController.getProcessInformations(req, res));
app.get(API_PREFIX + '/monitoring/torrent-destinations', (req: any, res: any) => monitoringController.getTorrentDestinations(req, res));
app.get(API_PREFIX + '/monitoring/logs', (req: any, res: any) => monitoringController.getLogs(req, res));

app.post(API_PREFIX + '/browser/add', (req: any, res: any) => torrentBrowserController.add(req, res));
app.get(API_PREFIX + '/browser/search', (req: any, res: any) => torrentBrowserController.search(req, res));

app.get('*', (req: any, res: any) => {
  const allowedExt = ['.js', '.ico', '.css', '.png', '.jpg', '.woff2', '.woff', '.ttf', '.svg','.json', '.webmanifest', '.txt' ];
  if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
    res.sendFile(path.resolve(`${__dirname}/${config.distPath}/${req.url.split('?')[0]}`));
  } else {
    res.sendFile(path.resolve(`${__dirname}/${config.distPath}/index.html`));
  }
});


// Allow any method from any host and log requests

app.use(API_PREFIX, jwtExpress({ secret: config.jwtSecret }).unless({ path: [API_PREFIX + '/login'] }));
app.listen(config.serverPort, config.bind, () => {
  loggerService.info(`Server now listening on ${config.bind}:${config.serverPort} with config ${program.config}`);
});
