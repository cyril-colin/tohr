export class LoggerService {
  private LOG_PREFIX_INFO = '   INFO | ';
  private LOG_PREFIX_DEBU = '   DEBU | ';
  private LOG_PREFIX_WARN = '   WARN | ';
  private LOG_PREFIX_ERRO = '   ERRO | ';
  constructor() { }

  debug(message: string, ...optionalParams: any[]) {
    console.log(new Date().toISOString() + this.LOG_PREFIX_DEBU + message, optionalParams);
  }

  info(message: string, ...optionalParams: any[]) {
    console.log(new Date().toISOString() + this.LOG_PREFIX_INFO + message, optionalParams);
  }

  error(message: string, ...optionalParams: any[]) {
    console.error(new Date().toISOString() + this.LOG_PREFIX_ERRO + message, optionalParams);
  }

  warn(message: string, ...optionalParams: any[]) {
    console.warn(new Date().toISOString() + this.LOG_PREFIX_WARN + message, optionalParams);
  }
}
