import * as HttpStatus from 'http-status-codes';
import { UnauthorizedError } from 'express-jwt';


export const BC_BAD_REQUEST = 'bad-request';
export const BC_INTERNAL_ERROR = 'unkown-internal-error';
export const BC_TRANSMISSION_ERROR = 'unkown-transmission-error';
export const BC_TORRENT_SEARCH_ERROR = 'unkown-torrent-search-error';
export const BC_UNAUTHORIZED_ERROR = 'unkown-unauthorized-error';

export class HttpError extends Error {
  httpCode: number = null;
  /**
   * The business code. This allow client to
   * bind a behaviour on this error.
   * ex: 'missing-id', 'missing-name', 'incorrect-path'...
   */
  businessCode: string;

  originalError: Error | Error[];

  constructor(httpCode: number, businessCode: string, originalError?: Error | Error[]) {
    super(businessCode);
    Object.setPrototypeOf(this, HttpError.prototype);
    this.httpCode = httpCode;
    this.businessCode = businessCode;
    this.originalError = originalError;
  }
}

export class HttpBadRequest extends HttpError {
  constructor(businessCode?: string) {
    super(HttpStatus.BAD_REQUEST, businessCode || BC_BAD_REQUEST);
  }
}

export class HttpInternalError extends HttpError {
  constructor(businessCode?: string, originalError?: Error | Error[]) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, businessCode || BC_INTERNAL_ERROR, originalError);
  }
}

export class HttpTransmissionError extends HttpError {
  constructor(originalError: Error, businessCode?: string) {
    super(HttpStatus.BAD_GATEWAY, businessCode || BC_TRANSMISSION_ERROR, originalError);
  }
}

export class HttpTorrentSearchError extends HttpError {
  constructor(originalError: Error, businessCode?: string) {
    super(HttpStatus.BAD_GATEWAY, businessCode || BC_TRANSMISSION_ERROR, originalError);
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(businessCode?: string) {
    super(HttpStatus.UNAUTHORIZED, businessCode || BC_UNAUTHORIZED_ERROR,);
  }
}

export function handleErrors (err: any, req: any, res: any, next: any) {
  console.error('error handler :', err);
  if (err instanceof UnauthorizedError) {
    const responseError = new HttpUnauthorizedError();
    res.status(responseError.httpCode).json(responseError);
  } else if (err instanceof HttpError) {
    delete err.originalError;
    res.status(err.httpCode).json(err);
  } else {
    const responseError = new HttpInternalError();
    res.status(responseError.httpCode).json(responseError);
  }
}
