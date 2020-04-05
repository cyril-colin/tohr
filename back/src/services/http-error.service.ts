import * as express from 'express';
import { LoggerService } from '../services/logger.service';

export interface ApiError {
  message: string;
}

export class HttpErrorService {
  constructor(
    private loggerService: LoggerService,
  ) { }

  public error500(response: express.Response, err: any): Promise<express.Response> {
    this.loggerService.error(err);
    return Promise.resolve(response.status(500).send({ message: 'Internal Error' } as ApiError));
  }

  public error400(message: string, response: express.Response, ...extraLog: any[]): Promise<express.Response> {
    this.loggerService.error(message, extraLog);
    return Promise.resolve(response.status(400).send({ message } as ApiError));
  }
}
