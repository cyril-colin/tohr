import express from 'express';
import * as path from 'path';
import program from 'commander';
import jwtExpress from 'express-jwt';
import { createLogger, transports, format } from 'winston';
import { TorrentController } from './src/controllers/torrent-controller';
import { LoginController } from './src/controllers/login-controller';
import { Environment } from './src/environment';
import { MonitoringController } from './src/controllers/monitoring-controller';
import { SystemInformationService } from './src/services/system-information.service';
import { LoggerService } from './src/services/logger.service';
import { TorrentBrowserController } from './src/controllers/torrent-browser-controller';
import { CurrentUserService } from './src/services/current-user.service';
import { handleErrors } from './src/core/errors';
import { JackettClient } from './src/clients/jacket-client/jackett-client';
import { TransmissionDaemonClient } from './src/clients/transmission-daemon-client/transmission-daemon-client';

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

const loggerService = new LoggerService(logger);
const tdClient = new TransmissionDaemonClient({
  url: config.transmissionDaemonUrl,
  login: config.transmissionDaemonLogin,
  password: config.transmissionDaemonPassword
});
const systemInformationService = new SystemInformationService();
const torrentController = new TorrentController(tdClient, config);
const monitoringController = new MonitoringController(config, systemInformationService);
const jacketClientService = new JackettClient(config.jackett.url, config.jackett.apiKey);
const torrentBrowserController = new TorrentBrowserController(jacketClientService, tdClient, config);
const currentUserService = new CurrentUserService();

const app = express();
app.use(express.static(__dirname + '/' +config.distPath));
const API_PREFIX = '/api';
app.use(API_PREFIX, express.json({limit: '50mb'}));
app.use((req: any, res: any, next: any) => {
  if (req.url !== API_PREFIX + '/torrents')
    loggerService.info(`${currentUserService.getUsername(req)} | ${req.method} ${req.url}`);
  next();
});
app.use(API_PREFIX, jwtExpress({ secret: config.jwtSecret }).unless({ path: [API_PREFIX + '/login'] }));

app.post(API_PREFIX + '/login', (req: any, res: any, next) => (new LoginController(config)).login(req, res, next).catch(next));
app.get(API_PREFIX + '/torrents', (req: any, res: any, next) => torrentController.getAll(req, res, next).catch(next));
app.get(API_PREFIX + '/torrents/:id', (req: any, res: any, next) => torrentController.get(req, res, next).catch(next));
app.put(API_PREFIX + '/torrents/:id/move', (req: any, res: any, next) => torrentController.move(req, res, next).catch(next));
app.put(API_PREFIX + '/torrents/:id/start', (req: any, res: any, next) => torrentController.start(req, res, next).catch(next));
app.put(API_PREFIX + '/torrents/:id/stop', (req: any, res: any, next) => torrentController.stop(req, res, next).catch(next));
app.get(API_PREFIX + '/torrents/:id/download', (req: any, res: any, next) => torrentController.download(req, res, next).catch(next));
app.delete(API_PREFIX + '/torrents/:id', (req: any, res: any, next) =>  torrentController.remove(req, res, next).catch(next));
app.post(API_PREFIX + '/torrents', (req: any, res: any, next) => torrentController.add(req, res, next).catch(next));

app.get(API_PREFIX + '/monitoring/disk-usage', (req: any, res: any, next) => monitoringController.diskUsage(req, res, next).catch(next));
app.get(API_PREFIX + '/monitoring/process-informations', (req: any, res: any, next) => monitoringController.getProcessInformations(req, res, next).catch(next));
app.get(API_PREFIX + '/monitoring/torrent-destinations', (req: any, res: any, next) => monitoringController.getTorrentDestinations(req, res, next).catch(next));
app.get(API_PREFIX + '/monitoring/logs', (req: any, res: any, next) => monitoringController.getLogs(req, res, next).catch(next));

app.post(API_PREFIX + '/browser/add', (req: any, res: any, next) => torrentBrowserController.add(req, res, next).catch(next));
app.get(API_PREFIX + '/browser/search', (req: any, res: any, next) => torrentBrowserController.search(req, res, next).catch(next));

/**
 * If no route match, let angular manage the not found errors.
 */
app.get('*', (req: any, res: any) => res.sendFile(path.resolve(`${__dirname}/${config.distPath}/index.html`)));

/**
 * Use our custom error handler to format error with compatible
 * data for front project.
 */
app.use(handleErrors);

/**
 * Run the server and perform some validation to make sur this will
 * work correctly.
 */
app.listen(config.serverPort, config.bind, async () => {
  loggerService.info(`Tohr server now listening on ${config.bind}:${config.serverPort} with config ${program.config}`);
  const checkPrefix = 'startup-check | ';
  tdClient.get()
  .then(() => loggerService.info(checkPrefix + 'Torrent client is alive.'))
  .catch(() => {
    loggerService.warn(checkPrefix + 'Torrent client has error.');
  });

  // const checkers: any[] = [];
  // config.monitoring.destinations.forEach(async d => checkers.push(systemInformationService.isDestinationExists(d)));
  // const noProblem = await Promise.all(checkers).catch(err => {
  //   loggerService.error(checkPrefix + 'Problem with torrent destinations : ', err);
  //   process.exit(1);
  // });
  // if (noProblem) {
  //   loggerService.info(checkPrefix + 'Torrent destinations are accessibles.');
  // }

  // const logFileExists = await systemInformationService.isLogFileExists(config).catch(err => {
  //   loggerService.error(checkPrefix + 'Problem logger file : ', err);
  //   process.exit(1);
  // });
  // if (logFileExists) {
  //   loggerService.info(checkPrefix + 'Log file exists : ' + config.logFile);
  // }
});
