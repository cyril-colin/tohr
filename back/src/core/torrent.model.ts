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
