import { Logger } from 'winston';

export class LoggerService {
  constructor(private logger: Logger) { }

  debug(message: string, ...optionalParams: any[]) {
    this.logger.log('debug', message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]) {
    this.logger.log('info', message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    this.logger.log('error', message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    this.logger.log('warn', message, ...optionalParams);
  }
}
