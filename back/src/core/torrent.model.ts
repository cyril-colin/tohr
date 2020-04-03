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
}

export interface BrowserTorrent {
  title: string;
  time: Date;
  seeds: number;
  peers: 0;
  size: string;
  desc: string;
  id: string;
  provider: string;
  link: string;
  computedData: BrowserComputedData;
}

export interface BrowserComputedData {
  title: string;
  tags: BrowserTag[];
};

export interface BrowserTag {
  name: string,
  color: string
}
