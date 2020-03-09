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
}


export const mockTorrents: Torrent[] = [
  { downloadDir: '/media/NFS/music', error: 0, errorString: null, id: 1, name: 'Ubuntu', percentDone: 0.5, rateDownload: 20, rateUpload: 20, totalSize: 90000 },
  { downloadDir: '/tmp/test', error: 0, errorString: null, id: 2, name: 'The.Handmaids.Tale.S03E08.MULTi.1080p.HDTV.x264-HYBRiS.mkv', percentDone: 0.5, rateDownload: 20, rateUpload: 20, totalSize: 90000 },
  { downloadDir: '/tmp/test', error: 0, errorString: null, id: 3, name: 'Middle Earth - Le Seigneur Des Anneaux & The Hobbit Version Longue MULTI Bluray 1080p DTS HDMA x264 - MAN OF STYLE', percentDone: 0.5, rateDownload: 20, rateUpload: 20, totalSize: 90000 },
]
