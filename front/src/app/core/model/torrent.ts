import { TorrentDestination } from './torrent-destination';

export interface Torrent {
  name: string;
  id: number;
  totalSize: number;
  downloadDir: string;
  percentDone: number;
  rateDownload: number;
  rateUpload: number;
  error: number;
  errorString: string;
  destination?: TorrentDestination;
  statusStr: string;
  status: number;
  addedDate: number;
  files: {bytesCompleted: number, length:number, name:string}[];
  trackers: {announce: string, scrape: string}[];
}

export interface TorrentMove {
  destinationName: string;
}

export interface TorrentPost {
  downloadDir: string;
  metainfo: string;
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
