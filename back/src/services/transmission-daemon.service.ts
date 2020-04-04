import * as NodeCache from 'node-cache';
import { Environment } from '../environment';
import axios, { AxiosRequestConfig } from 'axios';
import { LoggerService } from './logger.service';

export interface TransmissionRequest {
  arguments: any;
  method: string;
}


export class TransmissionDaemonService {
  static CACHE_SESSION_KEY = 'transmissionSessionId';
  static HEADER_TRANSMISSION_SESSION = 'x-transmission-session-id';
  static MAX_SESSION_ATTEMPT = 5;

  constructor(private cache: NodeCache, private config: Environment, private logger: LoggerService) { }

  public get(ids?: number[]): Promise<any> {
    const requestBody: TransmissionRequest = {
      method: 'torrent-get',
      arguments: {
        fields: ['id', 'name', 'totalSize', 'downloadDir', 'percentDone', 'rateDownload', 'rateUpload', 'error', 'errorString']
      }
    };

    if (ids) {
      requestBody.arguments.ids = ids;
    }

    // this.logger.debug('request : ', requestBody);
    return this.sendRequest(requestBody);
  }

  public add(downloadDir: string, metaInfo: string): Promise<any> {
    const requestBody: TransmissionRequest = {
      method: 'torrent-add',
      arguments: {
        'download-dir': downloadDir,
        metainfo: metaInfo,
      }
    };

    this.logger.debug('request : ', requestBody);
    return this.sendRequest(requestBody);
  }

  public addTorrentFile(filename: string, downloadDir: string): Promise<any> {
    const requestBody: TransmissionRequest = {
      method: 'torrent-add',
      arguments: {
        'download-dir': downloadDir,
        filename,
      }
    };

    this.logger.debug('request : ', requestBody);
    return this.sendRequest(requestBody);
  }

  public remove(id: string, deleteLocalData: boolean): Promise<any> {
    const requestBody: TransmissionRequest = {
      method: 'torrent-remove',
      arguments: { ids : [+id], 'delete-local-data': deleteLocalData}
    };

    this.logger.debug('request : ', requestBody);
    return this.sendRequest(requestBody);
  }

  public move(id: number, location: string): Promise<any> {
    const requestBody: TransmissionRequest = {
      method: 'torrent-set-location',
      arguments: {
        ids: [+id],
        location,
        move: true,
      }
    };

    this.logger.debug('request : ', JSON.stringify(requestBody));
    return this.sendRequest(requestBody);
  }

  private sendRequest(params: any, attempt = 0): Promise<any> {
    return axios.post(this.config.transmissionDaemonUrl, params, this.setAuthenticationHeader())
      .then((res: any) => {
        return res.data;
      }).catch((error: any) => {
        if (error.response && error.response.status === 409) {
          this.logger.info('Session not set or expired. Attempt number ' + attempt);
          if (attempt >= TransmissionDaemonService.MAX_SESSION_ATTEMPT) {
            throw error;
          }

          this.catchTransmissionSessionError(error.response);
          return this.sendRequest(params, attempt++);
        } else {
          throw error;
        }
      });
  }

  private catchTransmissionSessionError(axiosResponse: any) {
    const session = axiosResponse.headers[TransmissionDaemonService.HEADER_TRANSMISSION_SESSION];
    this.cache.set(TransmissionDaemonService.CACHE_SESSION_KEY, session);
  }


  private setAuthenticationHeader(): AxiosRequestConfig {
    const sessionId = this.cache.get<string>(TransmissionDaemonService.CACHE_SESSION_KEY);

    const token = Buffer.from(this.config.transmissionDaemonLogin + ':' + this.config.transmissionDaemonPassword).toString('base64');
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic ' + token,
      }
    };

    if (sessionId !== undefined) {
      const axiosConfig2 = {
        headers: {
          'Content-Type': 'application/json',
          [TransmissionDaemonService.HEADER_TRANSMISSION_SESSION]: sessionId,
          Authorization: 'Basic ' + token,
        }
      };

      return axiosConfig2;
    }


    return axiosConfig;
  }


}
