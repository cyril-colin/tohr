import { TorrentDestination } from './monitoring/torrent-destination.model';

export interface Torrent {
  downloadDir: string;
  error: number;
  errorString: string;
  id: number;
  name: string;
  percentDone: number;
  rateDownload: number;
  rateUpload: number;
  totalSize: number;
  destination?: TorrentDestination;
  statusStr: string;
  status: number;
}

/**
 * @see https://github.com/transmission/transmission/blob/master/libtransmission/transmission.h
 * The description of status
 */
export const TR_STATUS = {
  0: 'TR_STATUS_STOPPED',
  1: 'TR_STATUS_CHECK_WAIT',
  2: 'TR_STATUS_CHECK',
  3: 'TR_STATUS_DOWNLOAD_WAIT',
  4: 'TR_STATUS_DOWNLOAD',
  5: 'TR_STATUS_SEED_WAIT',
  6: 'TR_STATUS_SEED',
}



export interface BrowserTorrent {
  title: string;
  time: Date;
  seeds: number;
  peers: number;
  size: string;
  desc: string;
  id: string;
  provider: string;
  link: string;
  computedData: BrowserComputedData;
  destination?: any
}

export interface BrowserComputedData {
  title: string;
  tags: BrowserTag[];
};

export interface BrowserTag {
  name: string,
  color: string
}
