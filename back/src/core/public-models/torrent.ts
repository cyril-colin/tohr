import { TorrentDestination } from './torrent-destination';

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
  addedDate: number;
  files: {bytesCompleted: number, length:number, name:string}[];
  trackers: {announce: string, scrape: string}[];
}
