import NodeCache from 'node-cache';
import axios, { AxiosRequestConfig } from 'axios';
import { TDConfig } from './models/tdconfig.model';
import { TDRequest } from './models/tdrequest.model';
import {TD_STATUS} from './models/tdstatus.model';


/**
 * A client to manage with RPC API of transmission-daemon.
 *
 * @see https://github.com/transmission/transmission/blob/master/extras/rpc-spec.txt
 */
export class TransmissionDaemonClient {
  /**
   * The key in our cache to store the transmission-daemon cookie.
   */
  static CACHE_SESSION_KEY = 'transmissionSessionId';

  /**
   * The transmission-daemon key where we can find the cookie in
   * transmission daemon response.
   */
  static HEADER_TRANSMISSION_SESSION = 'x-transmission-session-id';

  /**
   * If a request to transmission-daemon fail (because of cookie issue),
   * we try again. This number is the maximum attempts.
   */
  static MAX_SESSION_ATTEMPT = 5;

  /**
   * The cache that will store the transmission-cookie.
   */
  cache: NodeCache;

  /**
   * This constructor will instanciate a NodeCache in order
   * to store the transmission-daemon token.
   *
   * @param config Object containing target url, login and password.
   */
  constructor(private config: TDConfig) {
    this.cache = new NodeCache();
   }


   /**
    * Return the complete list of all torrent stored in transmission daemon.
    *
    * @param ids The list of torrent id to get. All torrents are returned if empty.
    * @param fields The list of fields that have to be returned by transmission daemon.
    */
  public get(ids?: number[], fields: string[] =
    ['id', 'name', 'totalSize', 'downloadDir', 'percentDone', 'rateDownload', 'rateUpload', 'error', 'addedDate', 'errorString', 'status']): Promise<any> {
    const requestBody: TDRequest = {
      method: 'torrent-get',
      arguments: { fields }
    };

    if (ids) {
      requestBody.arguments.ids = ids;
    }

    return this.sendRequest(requestBody);
  }

  /**
   * Return the string status corresponding to the
   * given status number.
   */
  public getStatus(status: number): string {
    return TD_STATUS.find(s => s.value === status).text;
  }

  /**
   * This method will add and start a give torrent in base64.
   *
   * @param downloadDir Where the torrent data will land.
   * @param metaInfo The torrent file in base64.
   */
  public add(downloadDir: string, metaInfo: string): Promise<any> {
    const requestBody: TDRequest = {
      method: 'torrent-add',
      arguments: {
        'download-dir': downloadDir,
        metainfo: metaInfo,
      }
    };

    return this.sendRequest(requestBody);
  }

  /**
   * This method will add and start a torrent thanks to the
   * given location.
   *
   * @param filename The torrent file location on disk.
   * @param downloadDir Where the torrent data will land.
   */
  public addTorrentFile(filename: string, downloadDir: string): Promise<any> {
    const requestBody: TDRequest = {
      method: 'torrent-add',
      arguments: {
        'download-dir': downloadDir,
        filename,
      }
    };

    return this.sendRequest(requestBody);
  }

  /**
   * Remove the torrent corresponding to the given id.
   *
   * @param id The id of torrent we want to delete.
   * @param deleteLocalData If true, delete also data from disk. If false,
   * keep data but remove it from transmission-daemon.
   */
  public remove(id: string, deleteLocalData: boolean): Promise<any> {
    const requestBody: TDRequest = {
      method: 'torrent-remove',
      arguments: { ids : [+id], 'delete-local-data': deleteLocalData}
    };

    return this.sendRequest(requestBody);
  }

  /**
   * In order to move torrent data to another
   * directory.
   *
   * @param id Torrent id to move.
   * @param location New torrent location path.
   */
  public move(id: number, location: string): Promise<any> {
    const requestBody: TDRequest = {
      method: 'torrent-set-location',
      arguments: {
        ids: [+id],
        location,
        move: true,
      }
    };

    return this.sendRequest(requestBody);
  }

  /**
   * Stop given torrent downloading.
   *
   * @param id Torrent id to stop.
   */
  public stop(id: number): Promise<any> {
    const requestBody: TDRequest = {
      method: 'torrent-stop',
      arguments: { ids: [+id]}
    };

    return this.sendRequest(requestBody);
  }

  /**
   * Start torrent download.
   *
   * @param id Torrent id to start.
   */
  public start(id: number): Promise<any> {
    const requestBody: TDRequest = {
      method: 'torrent-start',
      arguments: { ids: [+id]}
    };

    return this.sendRequest(requestBody);
  }


  /**
   * This private method is used by other public method in order to
   * run all request to transmission-daemon.
   * The goal here is to manage with transmission-daemon cookie and
   * authentication.
   *
   * @param params The query to run
   * @param attempt The number of attempt (automatically increased
   * by recursive method)
   */
  private sendRequest(params: any, attempt = 0): Promise<any> {
    return axios.post(this.config.url, params, this.setAuthenticationHeader())
      .then((res: any) => {
        return res.data;
      }).catch((error: any) => {
        if (error.response && error.response.status === 409) {
          if (attempt >= TransmissionDaemonClient.MAX_SESSION_ATTEMPT) {
            throw error;
          }

          this.catchTransmissionSessionError(error.response);
          return this.sendRequest(params, attempt++);
        } else {
          throw error;
        }
      });
  }

  /**
   * When transmission-daemon return a session error,
   * we use this method to store the new cookie.
   *
   * @param axiosResponse The transmission-daemon response.
   */
  private catchTransmissionSessionError(axiosResponse: any) {
    const session = axiosResponse.headers[TransmissionDaemonClient.HEADER_TRANSMISSION_SESSION];
    this.cache.set(TransmissionDaemonClient.CACHE_SESSION_KEY, session);
  }


  /**
   * In order to authenticate each request to transmission-daemon.
   */
  private setAuthenticationHeader(): AxiosRequestConfig {
    const sessionId = this.cache.get<string>(TransmissionDaemonClient.CACHE_SESSION_KEY);

    const token = Buffer.from(this.config.login + ':' + this.config.password).toString('base64');
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
          [TransmissionDaemonClient.HEADER_TRANSMISSION_SESSION]: sessionId,
          Authorization: 'Basic ' + token,
        }
      };

      return axiosConfig2;
    }


    return axiosConfig;
  }


}
